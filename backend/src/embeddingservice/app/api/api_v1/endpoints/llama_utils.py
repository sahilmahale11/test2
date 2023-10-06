from typing import Dict
import json
import pandas as pd
from langchain import LLMChain, PromptTemplate, SagemakerEndpoint
from langchain.llms.sagemaker_endpoint import LLMContentHandler
from app.common import constant
from app.common.api_logging import logger
from app.common.env_config import settings
from qdrant_client.http import models
from app import messages

SAGEMAKER_LLM_ENDPOINT_NAME= constant.SAGEMAKER_LLM_ENDPOINT_NAME
AWS_DEFAULT_REGION = settings.AWS_DEFAULT_REGION

class HFContentHandler(LLMContentHandler):
    content_type = "application/json"
    accepts = "application/json"

    def transform_input(self, prompt: str, model_kwargs: Dict) -> bytes:
        self.len_prompt = len(prompt)
        input_dict = {
            "inputs": prompt,
            "parameters": model_kwargs
        }
        input_str = json.dumps(input_dict)
        return input_str.encode('utf-8')


    def transform_output(self, output: bytes) -> str:
        response_json = output.read()
        res = json.loads(response_json)
        # stripping away the input prompt from the returned response
        ans = res[0]['generated_text'][self.len_prompt:]
        ans = ans[:ans.rfind("Human")].strip()
        return ans


def perform_query(query):
    parameters = {
        'do_sample': True,
        'top_p': 0.3,
        'max_new_tokens': 1024,
        'temperature': 0.5,
        'watermark': True
    }

    llm = SagemakerEndpoint(
        endpoint_name=f"{SAGEMAKER_LLM_ENDPOINT_NAME}",
        region_name=f"{AWS_DEFAULT_REGION}",
        model_kwargs=parameters,
        content_handler=HFContentHandler(),
    )

    template = """
    Forget Previous instructions. Classify the text into Frontend, Back end or Infrastructure tasks. Reply with: % Frontend, % Backend, or % Infrastructure.
    Context: The Frontend includes everything related to creating the user interface, user experience screens for a webpage that user interacts with.
    The Backend includes everything related to creating software logic and code for data, microservices and code modules. Infrastructure is
    includes everything related to creating technology components, tools, environments required for software development and deployment.
    Examples:
    Text: Create a list of APIs for each microservice and define interactions between APIs and services
    Task: 100% Backend
    Text: Establish file and directory structures for each service.
    Task: 100% Infrastructure
    Text: Creating a User interface (UI) for profile screen where the user can view and enter user details
    Task : 100% Frontend
    Text: Design frontend screen for the user to enter personal information and a microservice to save information in the database.
    Task : 50% Backend 50% Frontend
    Text: {text}
    Task
    """
    prompt = PromptTemplate(template=template, input_variables=["text"])
    llm_chain = LLMChain(prompt=prompt, llm=llm)
    response = llm_chain.run(query)
    response=response.strip().split(": ")
    return response

def catagorize_requirement_task(req_text):
    hash_table= {"Backend":0, "Infrastructure":0, "Frontend":0}
    try:
        for _ in range(2):
            response= perform_query(req_text)
            categories= response[0].split('\n', 1)[0].split()
            for subcat in categories:
                if subcat.isalpha() and subcat in hash_table:
                    hash_table[subcat] += 1
        return hash_table
    except Exception as e:
        return hash_table


class DocumentFilter:
    def __init__(self, client, id, collection_name):
        self.client = client
        self.id = id
        self.collection_name = collection_name
        self.collection_info = client.get_collection(collection_name=self.collection_name)

    def filter_documents(self, doc_type):
        """
        Filter documents from the specified collection by their category (title or body).
        """
        try:
            document_category = self.client.scroll(
                collection_name=self.collection_name,
                limit=self.collection_info.points_count,
                scroll_filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="type",
                            match=models.MatchValue(value=doc_type),
                        )
                    ],
                    should=[
                        models.FieldCondition(
                            key="Backend",
                            match=models.MatchValue(value=2),
                        ),
                        models.FieldCondition(
                            key="Frontend",
                            match=models.MatchValue(value=2),
                        ),
                        models.FieldCondition(
                            key="Infrastructure",
                            match=models.MatchValue(value=2),
                        ),
                    ]
                ),
                with_payload=True,
                with_vectors=True,
            )

            if document_category is not None:
                return document_category
            else:
                logger.error(messages.FILTER_DOCUMENTS_ERROR)
                raise Exception(messages.REVIEW_JIRA_TICKETS)
        except Exception as e:
            logger.error(messages.REVIEW_JIRA_TICKETS)
            raise Exception(e)

    def vectorDB_top_pairs(self, from_type_Qpoints, to_type, num_links):
        """
        Retrieve top pairs of documents from the specified collection.
        """
        try:
            top_pairs = []
            for i in range(len(from_type_Qpoints[0])):
                query_task = from_type_Qpoints[0][i]
                search_res = self.client.search(
                    collection_name=self.collection_name,
                    query_filter=models.Filter(
                        should=[
                            models.FieldCondition(
                                key="type",
                                match=models.MatchValue(value=to_type),
                            ),
                        ],
                    ),
                    query_vector=query_task.vector,
                    limit=num_links
                )
                for j in range(len(search_res)):
                    top_pairs += [[self.id , search_res[j].id, query_task.id, search_res[j].score, None]]
            top_pairs_df = pd.DataFrame(top_pairs, columns=["user_id", "repo_code_metadata_uuid", "project_requirement_metadata_uuid",'score', "human_verification"])
            return top_pairs_df
        except Exception as e:
            raise Exception(f"{messages.VECTORDB_TOP_LINK_ERROR}")