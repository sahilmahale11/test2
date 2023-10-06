export interface userDetails {
    confirmPassword: string;
    email: string;
    first_name: string;
    last_name: string;
    organization: string;
    password: string;
}
export interface passwordValidate {
    confirmPassword: string;
    password: string;
}
export interface signupResponse {
    token: string;
    token_type: string;
    jira_authorized: boolean;
    github_authorized: boolean;
}
export interface loginDetails {
    email: string;
    password: string;
}
export interface repoSelectedType {
    repo_id: string;
    repo_name: string;
    owner_name: string;
}
export interface branchSelectedType {
    branch_name: string;
}
export interface addRepoType {
    repo_id: string;
    owner_name: string;
    repo_name: string;
    branch_name: string;
}
export type propType = {
    url: string;
};
export interface projectSelectedType {
    project_id: string;
    project_name: string;
    project_key: string;
}
