import requests
import uuid
import json
import boto3
import ast
import pandas as pd
import requests
from langchain.text_splitter import TokenTextSplitter 
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import Distance, VectorParams
from app.api.api_v1.endpoints import llama_utils
from app import crud
from app import messages
from app.common import constant, auth
from app.common.env_config import settings
from app.common.api_logging import logger
from app.schema import CodeType, Language, EmbedType, IssueType, LinkageStatusEnum
from app.common.models.onboarding import User
from retrying import retry


with open(constant.MODEL_CONFIG_FILE, 'r') as config_file:
    config_data = json.load(config_file)

QDRANT_CLOUD_API_KEY = constant.QDRANT_CLOUD_API_KEY
QDRANT_CLOUD_PATH = constant.QDRANT_CLOUD_PATH
GITHUB_BASE_REPO_URL = constant.GITHUB_BASE_REPO_URL
JIRA_CLOUD_API_URL = constant.JIRA_CLOUD_API_URL
AWS_ACCESS_KEY_ID = settings.AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY = settings.AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION = settings.AWS_DEFAULT_REGION
SAGEMAKER_RUNTIME = constant.SAGEMAKER_RUNTIME
SAGEMAKER_SENTENCE_TRANSFORMER_ENDPOINT_NAME = constant.SAGEMAKER_SENTENCE_TRANSFORMER_ENDPOINT_NAME

INPUT_TOKEN_LIMIT = config_data.get("sentence_transformer",{}).get("input_token_limit", 384)
OUTPUT_EMBEDDING_LIMIT = config_data.get("sentence_transformer",{}).get("output_embedding_limit", 768)
CHUNK_OVERLAP = config_data.get("sentence_transformer",{}).get("chunk_overlap", 0)

code_metadata = crud.CodeMetadataCRUD()
requirement_metadata = crud.RequirementMetadataCRUD()
user_resource_linkage = crud.UserResourceLinkageCRUD()
top_link_score = crud.TopLinkScoreCRUD()
user_oauth = crud.UserOAuthCRUD()


@retry(stop_max_attempt_number=3, wait_fixed=1000)  # Retry 3 times with a 1-second delay
def create_qdrant_collection(collection_name):
    '''
    Create a Qdrant client and collection for storing code embeddings
    '''
    try:
        client = QdrantClient(api_key=QDRANT_CLOUD_API_KEY, url=QDRANT_CLOUD_PATH)
        client.recreate_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size= OUTPUT_EMBEDDING_LIMIT, distance= Distance.COSINE))
        return client
    except Exception as e:
        logger.error(f"{messages.COLLECTION_CREATION_ERROR}:{e}")
        raise Exception(f"{messages.COLLECTION_CREATION_ERROR}:{e}")

def upsert_points_to_collection(client, points_list, collection_name):
    '''
    Upsert code embeddings into the Qdrant collection
    '''
    try:
        # Create a Batch of points with ids and vectors
        batch = models.Batch(
            ids=[point['id'] for point in points_list],
            vectors=[point['vector'] for point in points_list],
            payloads=[point['payload'] for point in points_list]
        )

        operation_info = client.upsert(
            collection_name=collection_name,
            points=batch,
            wait=True
        )
        return operation_info
    except Exception as e:
        logger.error(f"{messages.COLLECTION_UPSERT_ERROR}:{e}")
        raise Exception(f"{messages.COLLECTION_CREATION_ERROR}:{e}")

def remove_empty_lines(text: str):
    '''
    Remove empty lines from a text
    '''
    lines = text.split('\n')
    non_empty_lines = [line for line in lines if line.strip() != '']
    cleaned_text = '\n'.join(non_empty_lines)
    return cleaned_text

def split_code_into_chunks(code: str):
    '''
    Split code into different chunks based on classes and functions
    '''
    try:
        code = remove_empty_lines(code)
        lines = code.split('\n')
        chunks = []
        current_chunk = []
        inside_class = False

        for line in lines:
            if line.startswith('class') or line.startswith('async class'):
                if current_chunk:
                    chunks.append(current_chunk)
                    current_chunk = []
                inside_class = True
                current_chunk.append(line)

            elif line.startswith('def') or line.startswith('async def'):
                if current_chunk and not inside_class:
                    chunks.append(current_chunk)
                    current_chunk = []
                inside_class = False
                current_chunk.append(line)

            elif line.startswith('#') or line.startswith('@') or line.startswith("import ") or line.startswith("from "):
                continue

            else:
                inside_class = False
                current_chunk.append(line)

            # Check if the class definition has ended to reset the flag
            if inside_class and line.strip().endswith(':'):
                inside_class = False

        if current_chunk:
            chunks.append(current_chunk)

        non_empty_lists = [sublist for sublist in chunks if any(item.strip() != '' for item in sublist)]
        return non_empty_lists
    except Exception as e:
        logger.error(f"{messages.SPLIT_CODE_INTO_CHUNKS_ERROR}: {e}")
        raise Exception(f"{messages.SPLIT_CODE_INTO_CHUNKS_ERROR}: {e}")

def create_two_chunks(code_chunks):
    '''
    Split code chunks further if a script comes after functions in the same chunk
    '''
    result = []
    current_chunk = []
    inside = False
    for line in code_chunks:
        if line.startswith("def") or line.startswith("class") or line.startswith("async def ") or line.startswith("async class "):
            inside = True
            if current_chunk:
                result.append(current_chunk)
            current_chunk = [line]
        elif line.startswith(' ') and inside==True:
            current_chunk.append(line)
        else:
            if current_chunk:
                inside=False
                result.append(current_chunk)
            current_chunk = []
    if current_chunk:
        result.append(current_chunk)
    return result

def get_branches(username, repository, access_token):
    '''
    Get a list of branches in a GitHub repository
    '''

    api_url = f"{GITHUB_BASE_REPO_URL}{username}/{repository}/branches"
    headers = {"Authorization": f"Bearer {access_token}",
        'Accept': 'application/vnd.github+json'}
    
    branch_list = []
    page = 1
    while True:
        params = {'page': page}
        response = requests.get(api_url, headers=headers, params=params)
        if response.status_code == 200:
            branches = response.json()
            if not branches:
                break
            branch_list.extend([branch.get("name") for branch in branches])
            page += 1
        else:
            logger.error(f"{messages.GET_BRANCHES_ERROR}")
            return []
    return branch_list

def get_repository_files(username, repository, branch, access_token):
    '''
    Retrieve Python files from a GitHub repository and process them
    '''

    api_url = f"{GITHUB_BASE_REPO_URL}{username}/{repository}/contents?ref={branch}"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(api_url, headers=headers)
    if response.status_code == 200:
        contents = response.json()
        all_code_content = []

        def fetch_content_recursive(items, current_path=""):
            for item in items:
                if item['type'] == 'file' and item['name'].endswith('.py'):
                    file_url = item['download_url']
                    response = requests.get(file_url)
                    if response.status_code == 200:
                        content = response.text
                        file_info = {
                            'name': item['name'],
                            'path': current_path + '/' + item['name'],
                            'url_path': file_url,
                            'content': content
                        }
                        all_code_content.append(file_info)
                    else:
                        logger.error(f"{messages.FETCH_CONTENT_ERROR}: {item['name']}")
                if item['type'] == 'dir':
                    subdir_url = item['url']
                    subdir_response = requests.get(subdir_url, headers=headers)
                    if subdir_response.status_code == 200:
                        subdir_contents = subdir_response.json()
                        fetch_content_recursive(subdir_contents, current_path + '/' + item['name'])
                    else:
                        logger.error(f"{messages.GET_REPOSITORY_FILES_ERROR}: {item['name']}")

        fetch_content_recursive(contents)
        return all_code_content
    else:
        logger.error(messages.GET_REPOSITORY_ERROR)
        raise Exception(messages.GET_REPOSITORY_ERROR)

def sagemaker_embedding():
    sagemaker_runtime = boto3.client(
        SAGEMAKER_RUNTIME,
        aws_access_key_id = AWS_ACCESS_KEY_ID,
        aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
        region_name = AWS_DEFAULT_REGION
    )
    return sagemaker_runtime

def process_code_chunks(**kwargs):
    '''
    Process code chunks from GitHub repository files
    '''
    branches = get_branches(kwargs.get("owner_name"), kwargs.get("repo_name"), kwargs.get("access_token"))
    branch_name = kwargs.get("branch_name")
    if branch_name not in branches:
        raise Exception(f"{messages.INVALID_BRANCH_NAME_ERROR} branches: {branches}")
    code_contents = get_repository_files(kwargs.get("owner_name"), kwargs.get("repo_name"), branch_name, kwargs.get("access_token"))
    if code_contents:
        code_chunks_resp = []        
        for code_content in code_contents:
            code_chunks = []
            raw_content = "\n".join(code_content.get("content").splitlines())
            chunks = split_code_into_chunks(raw_content)
            for chunk in chunks:
                if any(line.startswith(("class ", "def ", "async def ", "async class ")) for line in chunk):
                    codes = create_two_chunks(chunk)
                    code_chunks.extend(codes)
            code_chunks.append([raw_content])
            for code_chunk in code_chunks:
                first_line = code_chunk[0].strip()
                if first_line.startswith('def '):
                    code_type = CodeType.FUNCTION
                    name = first_line.split('(')[0].split(' ')[1]
                elif first_line.startswith('async def '):
                    code_type = CodeType.FUNCTION 
                    name = first_line.split('(')[0].split(' ')[2]
                elif first_line.startswith('class '):
                    code_type = CodeType.CLASS 
                    name = first_line.split('(')[0].split(' ')[1]
                    name=name.split(':')[0]
                elif first_line.startswith('async class '):
                    code_type = CodeType.CLASS 
                    name = first_line.split('(')[0].split(' ')[2]
                    name=name.split(':')[0]
                else:
                    code_type = CodeType.SCRIPT 
                    name = code_content['name'].split('.py')[0]
                code_chunks_resp.append({
                    "file_path": code_content['path'],
                    "name": name,
                    "branch_name": branch_name,
                    "code_type": code_type,
                    "language": Language.PYTHON,
                    "content": code_chunk,
                    'url_path': code_content['url_path'],
                })
        return code_chunks_resp
    else:
        return []

def get_embeddings_from_tokenized_text(input_text, embeddings_model):
    '''
    Get embeddings from tokenized text segments
    '''
    embed_list = []
    embed_result = pd.DataFrame()
    if not isinstance(input_text, str):
        raise ValueError(messages.VALUE_ERROR)

    text_splitter = TokenTextSplitter(chunk_size=INPUT_TOKEN_LIMIT, chunk_overlap=CHUNK_OVERLAP)
    text_token_list = text_splitter.split_text(input_text)

    for text_token in text_token_list:
        response = embeddings_model.invoke_endpoint(
                        EndpointName=SAGEMAKER_SENTENCE_TRANSFORMER_ENDPOINT_NAME, 
                        Body=json.dumps({"inputs": text_token}), 
                        ContentType='application/json'
                        )
        if response['ResponseMetadata']["HTTPStatusCode"] == 200:
            embed_codes = ast.literal_eval(response['Body'].read().decode('utf-8')).get('vectors')
            embed_list.append(embed_codes)
        else:
            logger.error(f"{messages.SAGEMAKER_RESPONSE_ERROR}: {response['Error']['Message']}")
            raise Exception(f"{messages.SAGEMAKER_RESPONSE_ERROR}: {response['Error']['Message']}")
    
    embed_result = pd.concat([pd.DataFrame(embed) for embed in embed_list], axis=1)
    return embed_result.mean(axis=1).tolist()


def code_embedding_creation(db, user_repo_info_id, code_snippets, qdrantclient, collection_name):
    '''
    Create code embeddings and store them in Qdrant
    '''
    try:
        point_list = []
        embeddings = sagemaker_embedding()
        for code_dict in code_snippets:
            point_dict = {}
            new_metadata_data={}
            if "content" in list(code_dict.keys()):
                code_content = " ".join(code_dict["content"])
                if code_content != "":
                    mean_embed_code = get_embeddings_from_tokenized_text(code_content, embeddings)
                    embed_uuid = str(uuid.uuid4())
                    nclass= code_content.count("class")
                    ndef= code_content.count("def")
                    point_dict = {"id": embed_uuid, "vector": mean_embed_code,
                                    "payload":{"type": 'code', "file_path": code_dict["file_path"], "name": code_dict["name"],
                                             "branch_name": code_dict["branch_name"], "code_type": code_dict["code_type"].value,
                                             "language": code_dict["language"].value,"nclass":nclass,"ndef":ndef}}
                    point_list.append(point_dict)
                    new_metadata_data = { 
                                'embed_uuid': embed_uuid,
                                'name': code_dict["name"],
                                'branch_name': code_dict["branch_name"],
                                'code_type': code_dict["code_type"].value,
                                'language': code_dict["language"].value, 
                                'file_path': code_dict["file_path"],
                                'url_path': code_dict["url_path"]
                            }
                    code_metadata.create(db, user_repo_info_id, new_metadata_data)
                    logger.info(new_metadata_data)
        upsert_points_to_collection(qdrantclient, point_list, collection_name)
    except Exception as e:
        logger.error(f"{messages.CODE_EMBEDDING_CREATION_ERROR}:{e}")
        raise Exception(f"{messages.CODE_EMBEDDING_CREATION_ERROR}:{e}")
    
def description_data(raw_data):
    '''
    Fetch description name
    '''
    if isinstance(raw_data, dict):
        if 'type' in raw_data and raw_data['type'] == 'text':
            return raw_data.get('text', '')
        elif 'content' in raw_data:
            text_content = []
            for content_item in raw_data['content']:
                text_content.append(description_data(content_item))
            return " ".join(text_content)
        else:
            return ""
    elif isinstance(raw_data, list):
        text_content = []
        for item in raw_data:
            text_content.append(description_data(item))
        return " ".join(text_content)
    else:
        return ""
    
def get_parent_name(raw_data):
    '''
    Fetch parent name
    '''
    try:
        if isinstance(raw_data, dict):
            parent_info = raw_data.get("parent", None)
            if parent_info is not None:
                if isinstance(parent_info, dict):
                    parent_name = parent_info.get("key", "")
                else:
                    parent_name = parent_info
                return parent_name
    except Exception as e:
        return None
    
def get_jira_projects(access_token, cloud_id):
    '''
    Fetch JIRA projects
    '''
    project_url = f"{JIRA_CLOUD_API_URL}/{cloud_id}/rest/api/3/project"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }
    response = requests.get(project_url, headers=headers)
    if response.status_code == 200:
        project_list = response.json()
        user_project_list = []
        for project in project_list:
            user_project_list.append({
                "project_id": str(project.get("id")),
                "project_name": project.get("name"),
                "project_key": project.get("key")}
            )
        return user_project_list
    else:
        logger.error(f"{messages.GET_JIRA_PROJECT_ERROR} code: {response.status_code} message: {response.text}")
        return None
    
def process_requirments(**kwargs):
    '''
    Process requirements from JIRA project
    '''
    issue_info = []
    user_project_list = get_jira_projects(kwargs["access_token"],kwargs["cloud_id"])
    for project in user_project_list:
        if kwargs["project_key"] == project["project_key"]:
            issue_list = ["Story","Bug", "Epic", "Task"]
            base_url = f'{JIRA_CLOUD_API_URL}/{kwargs["cloud_id"]}/rest/api/3/search'
            for issue_type in issue_list:
                payload = {
                    'jql': f'project={kwargs["project_id"]}  AND issuetype = {issue_type}',
                    "maxResults": 1000,
                    "startAt": 0
                }
                headers = {
                    'Authorization': f'Bearer {kwargs["access_token"]}',
                    'Content-Type': 'application/json'
                }
                response = requests.post(base_url, headers=headers, json=payload)
                if response.status_code == 200:
                    issues_data = response.json()
                    for issue in issues_data.get('issues', []):
                        temp_dict ={}
                        temp_dict["issue_key"] = issue['key']
                        temp_dict["issue_type"] = IssueType[issue['fields']['issuetype']['name'].upper()]
                        temp_dict["issue_url"] =  issue.get('self',"")
                        temp_dict["issue_parent"] = get_parent_name(issue.get("fields"))
                        temp_dict["issue_title"] = issue['fields']['summary']
                        temp_dict["issue_description"] = description_data(issue.get("fields").get("description")).strip()
                        issue_info.append(temp_dict)
                else:
                    pass
    return issue_info

def requirement_embedding_creation(db, user_project_info_id, project_requirement, qdrantclient, collection_name):
    '''
    Create requirement embeddings and store them in Qdrant
    '''
    try:
        point_list = []
        embeddings = sagemaker_embedding()
        for issue_dict in project_requirement:
            if "issue_title" in list(issue_dict.keys()):
                issue_content = "".join(issue_dict["issue_title"])
                if issue_content != "":
                    point_dict= {}
                    new_metadata_data = {}
                    mean_embed_requirement = get_embeddings_from_tokenized_text(issue_content, embeddings)
                    embed_uuid = str(uuid.uuid4())
                    catg_hash =  llama_utils.catagorize_requirement_task(issue_content)
                    point_dict = {"id": embed_uuid, "vector": mean_embed_requirement,
                                    "payload":{"type": 'title',"Backend": catg_hash['Backend'],"Infrastructure": catg_hash['Infrastructure'], 
                                            "Frontend": catg_hash['Frontend'],"issue_key": issue_dict['issue_key']}}
                    new_metadata_data = {
                        "embed_uuid": embed_uuid,
                        "task_id": issue_dict['issue_key'],
                        "parent_id": issue_dict['issue_parent'],
                        "issue_type": issue_dict['issue_type'].value,
                        "embed_type": EmbedType.TITLE.value,
                        "url_path": issue_dict['issue_url']}
                    requirement_metadata.create(db, user_project_info_id, new_metadata_data)
                    logger.info(new_metadata_data)
                    point_list.append(point_dict)
        
            if "issue_description" in list(issue_dict.keys()):
                issue_content = "".join(issue_dict["issue_description"])
                if issue_content != "":
                    point_dict= {}
                    new_metadata_data = {}
                    mean_embed_requirement = get_embeddings_from_tokenized_text(issue_content, embeddings)
                    embed_uuid = str(uuid.uuid4())
                    catg_hash =  llama_utils.catagorize_requirement_task(issue_content)
                    point_dict = {"id": embed_uuid, "vector": mean_embed_requirement,
                                    "payload":{"type": 'body',"Backend": catg_hash['Backend'],"Infrastructure": catg_hash['Infrastructure'], 
                                            "Frontend": catg_hash['Frontend'],"issue_key": issue_dict['issue_key']}}
                    new_metadata_data = {
                        "embed_uuid": embed_uuid,
                        "task_id": issue_dict['issue_key'],
                        "parent_id": issue_dict['issue_parent'],
                        "issue_type": issue_dict['issue_type'].value,
                        "embed_type": EmbedType.BODY.value,
                        "url_path": issue_dict['issue_url']
                    }
                    requirement_metadata.create(db, user_project_info_id, new_metadata_data)
                    logger.info(new_metadata_data)
                    point_list.append(point_dict)
        upsert_points_to_collection(qdrantclient, point_list, collection_name) 

    except Exception as e:
        logger.error(f"{messages.REQUIREMENT_EMBEDDING_CREATION}:{e}")
        raise Exception(f"{messages.REQUIREMENT_EMBEDDING_CREATION}:{e}")

def populate_top_link(db, client, collection_name, user_id):
    '''
    populate the vectorDB top pair of collections
    '''
    try:
        document_filter = llama_utils.DocumentFilter(client, user_id, collection_name)
        body = document_filter.filter_documents("body")
        title = document_filter.filter_documents("title")
        top_pairs_body = document_filter.vectorDB_top_pairs(body, 'code', 1)
        top_pairs_title = document_filter.vectorDB_top_pairs(title, 'code', 1)
        top_pairs_combined = pd.concat([top_pairs_body, top_pairs_title])
        top_link_score.load_dataframe_into_db(db, top_pairs_combined)
    except Exception as e:
        logger.error(f"{messages.POPULATE_TOP_LINK_ERROR}:{e}")
        raise Exception(messages.REVIEW_JIRA_TICKETS)
    
def update_repo_project_status_in_DB(status, db, user_id, user_repo_info_id, user_project_info_id, message = None):
    '''
    Set status for code and requirements process status
    '''
    if status == "failed":
        code_metadata.update_user_repo_info_setup_status(db, user_repo_info_id, False)
        code_metadata.delete_by_user_id(db, user_repo_info_id=user_repo_info_id)
        requirement_metadata.update_user_project_info_setup_status(db, user_project_info_id, False)
        requirement_metadata.delete_by_user_id(db, user_project_info_id=user_project_info_id)
        user_resource_linkage.update(db, user_id=user_id, linkage_status=LinkageStatusEnum.FAILED.value, message = message )
        top_link_score.delete_by_id(db, user_id)
    elif status == "success":
        code_metadata.update_user_repo_info_setup_status(db, user_repo_info_id, True)
        requirement_metadata.update_user_project_info_setup_status(db, user_project_info_id, True)
        user_resource_linkage.update(db, user_id=user_id,linkage_status=LinkageStatusEnum.AWAITING_VALIDATION.value)
            

def repo_project_connection(db, user_id, user_repo_info_id, user_project_info_id):
    '''
    Generate embeddings for code and requirements and store the respective data in Postgres and Qdant Cloud
    '''
    try:
        if user_resource_linkage.read(db,user_id):
            user_resource_linkage.update(db, user_id=user_id,
                        linkage_status=LinkageStatusEnum.INITIATED.value)
        else:
            user_resource_linkage.create(db, user_id=user_id,
                        user_repo_info_id=user_repo_info_id, 
                        user_project_info_id=user_project_info_id,
                        linkage_status=LinkageStatusEnum.INITIATED.value)

        user_oauth_db_obj = user_oauth.read_by_user_id(db, user_id, "JIRA")
        user_oauth_db_obj = auth.check_jira_token_validity(db, user_oauth_db_obj)

        repo_info = code_metadata.get_combined_repo_info(db, user_repo_info_id)
        project_info = requirement_metadata.get_combined_project_info(db, user_project_info_id)
        code_snippets = process_code_chunks(**repo_info)
        project_requirement = process_requirments(**project_info)
        if not code_snippets:
            update_repo_project_status_in_DB("failed", db, user_id, user_repo_info_id, user_project_info_id, messages.CODE_SNIPPET_ERROR)
            raise Exception(messages.CODE_SNIPPET_ERROR)
            
        if not project_requirement:
            update_repo_project_status_in_DB("failed", db, user_id, user_repo_info_id, user_project_info_id, messages.PROJECT_REQUIREMENT_ERROR)
            raise Exception(messages.PROJECT_REQUIREMENT_ERROR)

        collection_name="{}_{}_{}_{}_{}_collection".format(user_id, repo_info['first_name'], repo_info['last_name'],
                                            repo_info['repo_id'],  project_info['project_id'])
        qdrantclient = create_qdrant_collection(collection_name)
        code_embedding_creation(db, user_repo_info_id, code_snippets, qdrantclient, collection_name)
        requirement_embedding_creation(db, user_project_info_id, project_requirement, qdrantclient, collection_name)
        update_repo_project_status_in_DB("success", db, user_id, user_repo_info_id, user_project_info_id)
        populate_top_link(db, qdrantclient, collection_name, user_id)
        return messages.REPO_CONNECTION_WITH_CODE_SPLITTER
        
    except Exception as e:
        logger.error(e)
        if str(e) not in [messages.CODE_SNIPPET_ERROR, messages.PROJECT_REQUIREMENT_ERROR, messages.REVIEW_JIRA_TICKETS]:
            update_repo_project_status_in_DB("failed", db, user_id, user_repo_info_id, user_project_info_id, messages.SOMETHING_WENT_WRONG)
            raise Exception(f"{messages.SOMETHING_WENT_WRONG}:{e}")
        else:
            update_repo_project_status_in_DB("failed", db, user_id, user_repo_info_id, user_project_info_id, str(e))
            raise Exception(e)

        
def repo_metadata_embedding(db, user_id, user_repo_info_id):
    '''
    Generate embeddings for code and store the data in Postgres and Qdant Cloud
    '''
    try:
        user_oauth_db_obj = user_oauth.read_by_user_id(db, user_id, "GITHUB")
        user_oauth_db_obj = auth.check_github_token_validity(db, user_oauth_db_obj)

        # Delete the repo metadata table by user repo info id
        code_metadata.delete_by_user_id(db, user_repo_info_id=user_repo_info_id)
        code_metadata.update_user_repo_info_setup_status(db, user_repo_info_id, False)

        repo_info = code_metadata.get_combined_repo_info(db, user_repo_info_id)
        code_snippets = process_code_chunks(**repo_info)
        if not code_snippets:
            code_metadata.update_user_repo_info_setup_status(db, user_repo_info_id, False)
            raise Exception(messages.CODE_SNIPPET_ERROR)
        user = db.query(User).filter_by(id=user_id).first()
        collection_name="{}_{}_{}_{}_{}_collection".format(user_id, user.first_name, user.last_name, repo_info['repo_id'],  repo_info['repo_name'])
        qdrantclient = create_qdrant_collection(collection_name)
        code_embedding_creation(db, user_repo_info_id, code_snippets, qdrantclient, collection_name)
        code_metadata.update_user_repo_info_setup_status(db, user_repo_info_id, True)
        return messages.REPO_CONNECTION_WITH_CODE_SPLITTER
        
    except Exception as e:
        logger.error(e)
        code_metadata.update_user_repo_info_setup_status(db, user_repo_info_id, False)
        if str(e) not in [messages.CODE_SNIPPET_ERROR]:
            raise Exception(f"{messages.SOMETHING_WENT_WRONG}:{e}")
        else:
            raise Exception(e)

def project_metadata_embedding(db, user_id, user_project_info_id):
    '''
    Generate embeddings for requirements and store the data in Postgres and Qdant Cloud
    '''
    try:
        user_oauth_db_obj = user_oauth.read_by_user_id(db, user_id, "JIRA")
        user_oauth_db_obj = auth.check_jira_token_validity(db, user_oauth_db_obj)
        
        # Delete the requirement metadata table by user project info id
        requirement_metadata.delete_by_user_id(db, user_project_info_id=user_project_info_id)
        requirement_metadata.update_user_project_info_setup_status(db, user_project_info_id, False)

        project_info = requirement_metadata.get_combined_project_info(db, user_project_info_id)
        project_requirement = process_requirments(**project_info)
        if not project_requirement:
            requirement_metadata.update_user_project_info_setup_status(db, user_project_info_id, False)
            raise Exception(messages.PROJECT_REQUIREMENT_ERROR)
        user = db.query(User).filter_by(id=user_id).first()
        collection_name="{}_{}_{}_{}_{}_collection".format(user_id, user.first_name, user.last_name, project_info['project_id'], project_info['project_name'])
        qdrantclient = create_qdrant_collection(collection_name)
        requirement_embedding_creation(db, user_project_info_id, project_requirement, qdrantclient, collection_name)
        requirement_metadata.update_user_project_info_setup_status(db, user_project_info_id, True)
        return messages.REPO_CONNECTION_WITH_CODE_SPLITTER
    except Exception as e:
        logger.error(e)
        requirement_metadata.update_user_project_info_setup_status(db, user_project_info_id, False)
        if str(e) not in [messages.PROJECT_REQUIREMENT_ERROR, messages.REVIEW_JIRA_TICKETS]:
            raise Exception(f"{messages.SOMETHING_WENT_WRONG}:{e}")
        else:
            raise Exception(e)