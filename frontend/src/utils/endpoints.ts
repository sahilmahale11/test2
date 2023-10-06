export const Enviate_API = {
    LOGIN: 'api/v1/onboardingservice/sign_in',
    SIGNUP: 'api/v1/onboardingservice/sign_up',
    GITHUB_URL: 'api/v1/onboardingservice/github/oauth_callback',
    JIRA_URL: 'api/v1/onboardingservice/jira/oauth_callback',
    GITHUB_INTEGRATE_URL:
        import.meta.env.VITE_ENV === 'production'
            ? 'https://github.com/login/oauth/authorize?client_id=71bdc0d0b108c7aec0e8&scope=repo%20read%3Auser'
            : 'https://github.com/login/oauth/authorize?client_id=60b1bda3790825235c9a&scope=repo%20read%3Auser',
    JIRA_INTEGRATE_URL:
        import.meta.env.VITE_ENV === 'production'
            ? 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=YPlL2PoorJQinc1dIuYNZWqSQ2JS7Wql&scope=read%3Ajira-work%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20offline_access&redirect_uri=https%3A%2F%2Ftheoversight.ai%2Fauth&state=E6KB3MkkONKm7xcm8heLRIC-Z3GrHca3wdBTXQ9EudI&response_type=code&prompt=consent'
            : 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=ynBK1K25l39hDduohCmOtkfbMmvKnoF8&scope=read%3Ajira-work%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20offline_access&redirect_uri=https%3A%2F%2Fstaging.theoversight.ai%2Fauth&state=JSrqdwvG630S9KZOdHH8AypVT4MjIbASXlol07hwWbk}&response_type=code&prompt=consent',
    GITHUB_REPO: 'api/v1/onboardingservice/github/repository',
    GET_REPO: 'api/v1/onboardingservice/github/repositories',
    TASK_TABLE: 'api/v1/taskmanagerservice/tasks',
    USER_CONNECTIONS: 'api/v1/onboardingservice/user/connections',
    GET_JIRA_PROJECTS: 'api/v1/onboardingservice/jira/projects',
    POST_JIRA_PROJECT: 'api/v1/onboardingservice/jira/project',
    PROFILE_DATA: 'api/v1/onboardingservice/user/data',
    HUMAN_VERIFICATION_DATA: 'api/v1/humaninloopservice/confirmation/scores',
    GET_BEGIN_ANALYSIS: 'api/v1/embeddingservice/begin-ai-analysis',
    POST_HUMAN_VERIFICATION: 'api/v1/humaninloopservice/confirmation/scores/validate',
    POST_VERIFICATION_STATUS_CHECK: 'api/v1/humaninloopservice/confirmation/status/complete',
};
// export const filerunner = () => {
//     if (import.meta.env.VITE_ENV === 'production') {
//         // eslint-disable-next-line no-console
//         console.log('prod url');
//         return {
//             LOGIN: ':3000/api/v1/onboardingservice/sign_in',
//             SIGNUP: '/api/v1/onboardingservice/sign_up',
//             GITHUB_URL: 'http://localhost:3000/api/v1/onboardingservice/github/oauth_callback',
//             JIRA_URL: 'http://localhost:3000/api/v1/onboardingservice/jira/oauth_callback',
//             GITHUB_INTEGRATE_URL: 'https://github.com/login/oauth/authorize?client_id=Iv1.2034d493a8c39107&scope=repo%20read%3Ausers',
//         };
//     } else {
//         // eslint-disable-nexext-line no-console
//         console.log('dev url');
//         return {
//             LOGIN: ':3000/api/v1/onboardingservice/sign_in',
//             SIGNUP: '/api/v1/onboardingservice/sign_up',
//             GITHUB_URL: 'http://localhost:3000/api/v1/onboardingservice/github/oauth_callback',
//             JIRA_URL: 'http://localhost:3000/api/v1/onboardingservice/jira/oauth_callback',
//             GITHUB_INTEGRATE_URL: 'https://github.com/login/oauth/authorize?client_id=Iv1.2034d493a8c39107&scope=repo%20read%3Ausers',
//         };
//     }
// };
