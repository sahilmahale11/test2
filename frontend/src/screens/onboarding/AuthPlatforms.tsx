import { useLocation, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { authValues } from '../../utils/constants';
import authAxios from '../../service/http-service';
import Appbar from '../../components/header/Appbar';
import Footer from '../../components/footer/Footer';
import { Enviate_API } from '../../utils/endpoints';
import ModalComponent from '../../components/project_modal/ModalComponent';
import {
    StyledAuthContainer,
    StyledColumnBox,
    StyledHeadingTypography,
    StyledRowBox,
    StyledButton,
    StyledBox,
    StyledSubmitButton,
    StyledContentTypography1,
    StyledContentTypography2,
    StyledSubHeadingTypography,
    StyledContentTypographyHighlited,
} from './AuthStyles';
import { DataContext } from '../../context/DataContext';
import { Box, CircularProgress } from '@mui/material';
import ErrorBar from '../../components/error/ErrorBar';
import RepoComponent from '../../components/repo_modal/RepoComponent';
import { LoaderBox } from './SignupScreenCss';
import { Fonts } from '../../utils/Theme';
const MemorizedRepoComponent = React.memo(RepoComponent);
const MemorizedProjectComponent = React.memo(ModalComponent);

const AuthPlatforms = () => {
    const tokenContext = useContext(DataContext);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [githubOpen, setGithubOpen] = useState(false);
    const [githubCode, setGithubCode] = useState('');
    const [jiraCode, setJiraCode] = useState('');
    const location = useLocation();
    const [githubDisabled, setGithubDisabled] = useState(false);
    const [jiraDisabled, setJiraDisabled] = useState(false);
    const [responseError, setResponseError] = useState('');
    const [openErrorBar, setOpenErrorBar] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        if (urlParams.has('code')) {
            const extractedCode = urlParams.get('code');
            if (extractedCode && extractedCode.length < 30) {
                setGithubCode(extractedCode);
            } else {
                if (extractedCode) {
                    setJiraCode(extractedCode);
                }
            }
        }
    }, [location.search]);

    useEffect(() => {
        connections_refetch();
    }, []);

    const {
        refetch: connections_refetch,
        data: connections_data,
        isLoading: connectionLoader,
    } = useQuery({
        queryKey: ['user_connections'],

        queryFn: async () => {
            try {
                const data = await authAxios.get(Enviate_API.USER_CONNECTIONS);
                return data.data;
            } catch (err: any) {
                const myError = err;
                setResponseError(myError.response.data.detail);
                setOpenErrorBar(true);
                throw new Error(err.response.data.detail);
            }
        },

        retry: false,
        retryOnMount: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        keepPreviousData: false,

        onSuccess: (data: any) => {
            if (data.github_authorized) {
                setGithubDisabled(true);
            }

            if (data.jira_authorized) {
                setJiraDisabled(true);
            }
        },
    });

    const { refetch, status: statusGithub } = useQuery({
        enabled: !!githubCode,
        queryKey: ['github_integrate'],

        queryFn: async () => {
            try {
                const data = await authAxios.get(Enviate_API.GITHUB_URL, {
                    params: { access_code: githubCode },
                });
                return data.data;
            } catch (error: any) {
                setOpenErrorBar(true);
                setResponseError(error.response.data.detail);
                throw new Error(error.response.data.detail);
            }
        },
        retry: false,
        retryOnMount: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        keepPreviousData: false,
    });

    const { refetch: refetchJira, status: statusJira } = useQuery({
        enabled: !!jiraCode,
        queryKey: ['jira_integrate'],

        queryFn: async () => {
            try {
                const data = await authAxios.get(Enviate_API.JIRA_URL, {
                    params: { access_code: jiraCode },
                });

                return data.data;
            } catch (err: any) {
                setOpenErrorBar(true);
                setResponseError(err.response.data.detail);
                // eslint-disable-next-line no-console
                console.log('err is bascially', err.response.data.detail);
                throw new Error(err.response.data.detail);
            }
        },

        retry: false,
        retryOnMount: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    const { mutate } = useMutation({
        mutationFn: (oldUser: any) => {
            try {
                return authAxios.post(
                    `api/v1/embeddingservice/begin-ai-analysis?user_repo_info_id=${oldUser.repo_info_id}&user_project_info_id=${oldUser.project_info_id}`,
                );
            } catch (err: any) {
                // eslint-disable-next-line no-console
                console.log('err', err);
                throw new Error(err.response.data.detail);
            }
        },

        onSuccess() {
            navigate('/enviateAnalysis');
        },

        onError(error: any) {
            setOpenErrorBar(true);
            setResponseError(error.response.data.detail);
            throw new Error(error.response.data.detail);
        },
    });

    const handleSubmit = () => {
        const obj = {
            repo_info_id: connections_data.repo_details.user_repo_info_id,
            project_info_id: connections_data.project_details.user_project_info_id,
        };

        mutate(obj);
    };

    useEffect(() => {
        if (githubCode !== '' && statusGithub === 'loading') {
            refetch();
        }

        if (statusGithub === 'success' && githubCode) {
            setGithubOpen(true);
        }
    }, [githubCode, refetch, statusGithub]);

    useEffect(() => {
        if (jiraCode !== '' && statusJira === 'loading') {
            refetchJira();
        }

        if (statusJira === 'success' && jiraCode) {
            if (jiraCode !== '') {
                setModalOpen(true);
            }
        }
    }, [jiraCode, refetchJira, statusJira]);

    if (connectionLoader) {
        return (
            <LoaderBox>
                <CircularProgress />
            </LoaderBox>
        );
    }

    return (
        <>
            <StyledAuthContainer>
                <Appbar />

                {openErrorBar && <ErrorBar message={responseError} setOpen={setOpenErrorBar} />}

                {statusJira === 'success' && !tokenContext.userDetails?.jira_authorized && (
                    <MemorizedProjectComponent
                        open={modalOpen}
                        handleClose={() => {
                            setModalOpen(false);
                            connections_refetch();
                        }}
                    />
                )}

                {statusGithub === 'success' && !tokenContext.userDetails?.github_authorized && !!githubCode && (
                    <MemorizedRepoComponent
                        open={githubOpen}
                        handleClose={() => {
                            setGithubOpen(false);

                            connections_refetch();
                        }}
                    />
                )}

                <StyledColumnBox>
                    <StyledHeadingTypography>{authValues.accountIntegration}</StyledHeadingTypography>
                    <StyledSubHeadingTypography>{authValues.welcome}</StyledSubHeadingTypography>
                    <StyledContentTypography1>
                        Step one in our onboarding process will be for us connect your code and requirements to our system and build your dashboards.
                    </StyledContentTypography1>

                    <StyledContentTypography2>
                        If you are not an administrator or owner for your Jira or GitHub accounts, you may need to reach out to your internal site
                        administrators.
                    </StyledContentTypography2>
                </StyledColumnBox>

                <StyledRowBox>
                    <StyledButton href={Enviate_API.GITHUB_INTEGRATE_URL} disabled={githubDisabled}>
                        {connections_data?.github_authorized ? authValues.githubConnected : authValues.connectGithub}
                    </StyledButton>

                    <StyledBox connected={githubDisabled && jiraDisabled}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='153'
                            height='76'
                            viewBox='0 0 153 76'
                            fill='none'
                            style={{
                                width: '9.49969rem',
                                height: '4.73319rem',
                                flexShrink: ' 0',
                                position: 'relative',
                                marginTop: '11.38rem',
                                marginLeft: '9.18rem',
                                marginBottom: '-0.5rem',
                            }}>
                            <path
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                                d='M76.3936 20.5796L44.9548 71.5496C44.2481 72.6954 43.0281 73.4256 41.6844 73.5071L4.78382 75.7466C3.24214 75.8402 1.77675 75.0672 0.983535 73.7419C0.190323 72.4167 0.201319 70.7598 1.0122 69.4453L36.9079 11.2494C40.1984 5.91483 45.4731 2.10589 51.5719 0.660496C57.6706 -0.784895 64.0937 0.251621 69.4282 3.54214L76.3936 7.83859L83.3589 3.54214C88.6934 0.251621 95.1165 -0.784895 101.215 0.660496C107.314 2.10589 112.589 5.91483 115.879 11.2494L151.775 69.4453C152.586 70.7598 152.597 72.4167 151.804 73.7419C151.01 75.0672 149.545 75.8402 148.003 75.7466L111.103 73.5071C109.759 73.4256 108.539 72.6954 107.832 71.5496L76.3936 20.5796Z'
                                fill='white'
                            />
                        </svg>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='153'
                            height='77'
                            viewBox='0 0 153 77'
                            fill='none'
                            style={{
                                width: '9.49969rem',
                                height: '4.73319rem',
                                flexShrink: ' 0',
                                marginBottom: '10.80rem',
                                marginLeft: '12.56rem',
                                position: 'relative',
                            }}>
                            <path
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                                d='M76.4546 68.3942L69.4893 72.6906C64.1547 75.9811 57.7316 77.0176 51.6329 75.5722C45.5342 74.1268 40.2594 70.3179 36.9689 64.9833L1.07321 6.78745C0.262398 5.47285 0.251333 3.81612 1.04455 2.49087C1.83776 1.16562 3.30315 0.392539 4.84483 0.486149L41.7454 2.72558C43.0891 2.80716 44.3091 3.53735 45.0158 4.68315L76.4546 55.6531L107.893 4.68315C108.6 3.53735 109.82 2.80716 111.164 2.72558L148.064 0.486149C149.606 0.392539 151.071 1.16562 151.865 2.49087C152.658 3.81612 152.647 5.47285 151.836 6.78745L115.94 64.9833C112.65 70.3179 107.375 74.1268 101.276 75.5722C95.1775 77.0176 88.7544 75.9811 83.42 72.6906L76.4546 68.3942ZM65.1456 65.6484L70.7617 62.1842L39.101 10.8544L12.2998 9.22784L44.011 60.6396C46.1494 64.1065 49.5775 66.5818 53.541 67.5212C57.5044 68.4605 61.6787 67.7869 65.1456 65.6484ZM87.7636 65.6484C91.2304 67.7869 95.4047 68.4605 99.3683 67.5212C103.332 66.5818 106.76 64.1065 108.898 60.6395L140.609 9.22784L113.808 10.8544L82.1474 62.1842L87.7636 65.6484Z'
                                fill='white'
                            />
                        </svg>
                    </StyledBox>

                    <StyledButton href={Enviate_API.JIRA_INTEGRATE_URL} disabled={jiraDisabled}>
                        {connections_data?.jira_authorized ? authValues.jiraConnected : authValues.connectJira}
                    </StyledButton>
                </StyledRowBox>

                {connections_data?.github_authorized && connections_data?.jira_authorized ? (
                    <StyledSubmitButton onClick={handleSubmit}>{authValues.beginAnalysis}</StyledSubmitButton>
                ) : (
                    <Box sx={{ marginBottom: '5%' }}></Box>
                )}
                <Box sx={{ marginLeft: 'auto', marginRight: '5.9%', width: '38rem', height: 'fit-content', marginBottom: '2rem' }}>
                    <StyledSubHeadingTypography>{authValues.dataPrivacy}</StyledSubHeadingTypography>
                    <StyledContentTypography2>
                        Enviate takes your data privacy requirements seriously, and we do everything we can to keep the assets you give us safe. We
                        recognize that your requirements and code represent core assets for your organization. For this reason,{' '}
                        <StyledContentTypographyHighlited fontSize={Fonts.copySectionHeaders} fontWeight={700}>
                            Enviate does not store any of your code or requirements.
                        </StyledContentTypographyHighlited>{' '}
                        We pull these assets and only store an embedding representation of these assets, along with some metadata like the filename
                        and filepath of your code, or the ticket number of your Jira requirement. These embeddings cannot be reverse-engineered - it
                        is impossible to turn these embeddings back into code. Any time you see your code on our platform, it has been pulled and
                        displayed<StyledContentTypographyHighlited> without ever being persisted.</StyledContentTypographyHighlited>
                    </StyledContentTypography2>
                </Box>

                <Footer />
            </StyledAuthContainer>
        </>
    );
};

export default AuthPlatforms;
