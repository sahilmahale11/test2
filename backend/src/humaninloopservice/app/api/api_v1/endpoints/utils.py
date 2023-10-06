import requests
import ast
from app.common.api_logging import logger
from app import crud,schema, messages
from app.common.auth import check_jira_token_validity
from concurrent.futures import ThreadPoolExecutor
from app.schema import HumanVerification,LinkageStatusEnum
userOAuth = crud.UserOAuthCRUD()


class DataExtractor:
    """
    Extracts data from requirements
    """
    def __init__(self, access_token):
        self.access_token = access_token
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json"
        }

    @staticmethod
    def description_data(req_data):
        """
        Extracts description data from requirement data
        """
        if isinstance(req_data, dict):
            if 'type' in req_data and req_data['type'] == 'text':
                return req_data.get('text', '')
            elif 'content' in req_data:
                text_content = []
                for content_item in req_data['content']:
                    text_content.append(DataExtractor.description_data(content_item))
                return " ".join(text_content)
            else:
                return ""
        elif isinstance(req_data, list):
            text_content = []
            for item in req_data:
                text_content.append(DataExtractor.description_data(item))
            return " ".join(text_content)
        else:
            return ""

    def get_desc_title(self, requirements_info):
        """
        Gets description and title from requirements
        """
        response = requests.get(requirements_info["url_path"], headers=self.headers)
        if response.status_code == 200:
            file_content = response.json()
            return schema.RequirementInfo(task_id = file_content["key"], 
                                        title = file_content['fields']['summary'],
                                        description = DataExtractor.description_data(file_content.get("fields").get("description")).strip())
        else:
           logger.error(f"{messages.GET_DESC_TITLE_ERROR}")
           raise Exception(messages.GET_DESC_TITLE_ERROR)


class CodeExtractor:
    """
    Extracts code details.
    """
    def __init__(self, access_token):
        """
        Initializes the CodeExtractor with an access token
        """
        self.access_token = access_token

    def ast_extract_function_contents(self, script_contents, function_name):
        """
        Extracts function contents using AST parsing.
        """
        try:
            tree = ast.parse(script_contents)
        except SyntaxError as e:
            logger.error(f"{messages.GET_DETAILS_TOP_SCORE_ERROR}: {str(e)}")
            raise ValueError(messages.INVALID_PYTHON_SCRIPT_ERROR)

        function_contents = None

        class FunctionFinder(ast.NodeVisitor):
            def visit_FunctionDef(self, node):
                if node.name == function_name:
                    nonlocal function_contents
                    function_contents = ast.get_source_segment(script_contents, node)

            def visit_AsyncFunctionDef(self, node):
                if node.name == function_name:
                    nonlocal function_contents
                    function_contents = ast.get_source_segment(script_contents, node)

        finder = FunctionFinder()
        finder.visit(tree)

        if function_contents is not None:
            return function_contents
        else:
            logger.error(messages.EXTRACT_FUNCTION_ERROR)
            raise ValueError(f"{messages.EXTRACT_FUNCTION_ERROR}: {function_name}")

    def extract_class_contents(self, script_contents, class_name):
        """
        Extracts class contents from a script
        """
        tree = ast.parse(script_contents)

        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef) and node.name == class_name:
                class_source_code = ast.unparse(node)
                return class_source_code
        logger.error(messages.EXTRACT_CLASS_ERROR)
        raise ValueError(f"{messages.EXTRACT_CLASS_ERROR}: {class_name}")

    def get_python_code_details(self, code_info):
        """
        Gets code details including contents and file path
        """
        headers = {
            'Authorization': f'token {self.access_token}'
        }
        code_type = code_info["type"].value
        name = code_info["name"]
        contents = ""
        response = requests.get(code_info["file_uri"], headers=headers)
        if response.status_code == 200:
            file_content = response.text
            if code_type == "FUNCTION":
                contents = self.ast_extract_function_contents(file_content, name)
            elif code_type == "CLASS":
                contents = self.extract_class_contents(file_content, name)
            elif code_type == "SCRIPT":
                contents = file_content
            else:
                logger.error(messages.INVALID_FILE_CONTENTS_ERROR)
                raise Exception(messages.INVALID_FILE_CONTENTS_ERROR)
            file_path = code_info["file_uri"].replace("https://raw.githubusercontent.com/","").split("?")[0]     
        return schema.CodeInfo(name = name, file_path = file_path, contents = contents)


def get_top_scores(jwt_payload, db, toplink):
    """
    Gets the top scores for a user
    """
    try:
        task_ids = []
        total_top_score = {"user_id": jwt_payload['id'], "top_score_pairs": []}

        top_link_info = toplink.read_by_user_id(db, jwt_payload['id'])

        for top_score in top_link_info:
            requirement_name = top_score["requirement_info"]["name"]

            if requirement_name not in task_ids:
                total_top_score["top_score_pairs"].append(top_score)
                task_ids.append(requirement_name)

            if len(total_top_score["top_score_pairs"]) == 5:
                break
        return total_top_score
    except Exception as e:
        logger.error(f"{messages.GET_TOP_SCORE_ERROR}: {str(e)}")
        raise Exception(messages.GET_TOP_SCORE_ERROR)


def get_toplink_score(db, toplink_crud):
    """
    Gets detailed information about the top scores
    """
    try:
        logger.info("Initiating the retrieval of top link scores for code and requirements")
        jira_info = check_jira_token_validity(db, userOAuth.read_by_user_id(db, toplink_crud['user_id'], "JIRA"))
        github_info = userOAuth.read_by_user_id(db, toplink_crud['user_id'], "GITHUB")
        total_top_score_list = []
        def process_top_link(top_link_data):
            fetch_code = CodeExtractor(github_info.access_token)
            code_res = fetch_code.get_python_code_details(top_link_data["code_info"])

            data_extractor = DataExtractor(jira_info.access_token)
            requirement_res = data_extractor.get_desc_title(top_link_data["requirement_info"])

            total_top_score_list.append(schema.TopLinkInfo(
                                    top_link_id = top_link_data["top_link_id"],
                                    top_link_score = top_link_data["score"],
                                    code_info = code_res,
                                    requirement_info = requirement_res,
                                    human_verification = top_link_data["human_verification"].value if top_link_data["human_verification"] else None))

        with ThreadPoolExecutor() as executor:
            executor.map(process_top_link, toplink_crud['top_score_pairs'])
        total_top_score_list = sorted(total_top_score_list, key=lambda x: x.top_link_score, reverse=True)
        logger.info("Successfully completed the retrieval of top link scores for code and requirements")
        return total_top_score_list
    except Exception as e:
        logger.error(f"{messages.GET_DETAIL_TOP_SCORE_ERROR}: {str(e)}")
        raise Exception(messages.GET_DETAIL_TOP_SCORE_ERROR)


def update_toplink_score(db, toplink, toplink_crud):
    update_statements = []
    pass_count = 0 
    
    for entry in toplink:
        top_link_id = entry.top_link_id

        if entry.human_verification:
            pass_count += 1
            verification = HumanVerification.PASS.value
        else:
            verification = HumanVerification.FAIL.value

        update_statement = {
            'id': top_link_id,
            'human_verification': verification,
        }
        update_statements.append(update_statement)

    toplink_crud.update_human_verification(db, update_statements)
    
    if pass_count >= 3:
        return LinkageStatusEnum.SUPPORTED.value, None
    return LinkageStatusEnum.UNSUPPORTED.value, messages.REASON_FOR_UNSUPPORTED

