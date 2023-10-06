import EditorComponent from '../../components/human_validation/EditorComponent';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import {
    StyledAuthContainer,
    StyledColumnBox,
    StyledContentTypography,
    StyledHeadingTypography,
    StyledRowBox,
    StyledRowTask,
    StyledTextBox,
    StyledEditorBox,
    StyledDescriptionBox,
} from './HumanValidationStyle';
import Footer from '../../components/footer/Footer';
import Appbar from '../../components/header/Appbar';
import { authValues, validateValues } from '../../utils/constants';
import TaskCard from '../../components/human_validation/TaskCard';
import StepperComponent from '../../components/human_validation/StepperComponent';
import ErrorBar from '../../components/error/ErrorBar';
import { useQuery, useMutation } from '@tanstack/react-query';
import authAxios from '../../service/http-service';
import { Enviate_API } from '../../utils/endpoints';
import { LoaderBox } from '../onboarding/SignupScreenCss';
import { DataContext } from '../../context/DataContext';
import { StyledButton, StyledSubheading } from '../EnviateAnalysis/EnviateAnalysisStyles';
import { Colors } from '../../utils/Theme';
import { useNavigate } from 'react-router-dom';
const HumanValidateScreen = () => {
    const [activeCodeIndex, setActiveCodeIndex] = useState(0);
    const [storeActiveIndex, setStoreActiveIndex] = useState<any>([]);
    const [openErrorBar, setOpenErrorBar] = useState(false);
    const [supportedData, setSupportedData] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigate();

    const tokenContext = useContext(DataContext);
    const {
        data: verificationCode,
        refetch: refetchVerificationCode,
        isLoading,
    } = useQuery({
        enabled: true, // Fetch data immediately
        queryKey: ['verification_data'],
        queryFn: async () => {
            try {
                const response = await authAxios.get(Enviate_API.HUMAN_VERIFICATION_DATA);
                return response.data;
            } catch (error: any) {
                setError(error.response.data.detail);
                setOpenErrorBar(true);
                throw new Error(error.response.data.detail);
            }
        },
        retry: false,
        retryOnMount: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });
    const { mutate: mutate1, data: post_data } = useMutation({
        mutationFn: (oldUser: any) => {
            try {
                return authAxios.post(Enviate_API.POST_HUMAN_VERIFICATION, oldUser);
            } catch (err: any) {
                // eslint-disable-next-line no-console
                console.log('err', err);
                setError(err.response.data.detail);
                setOpenErrorBar(true);
                throw new Error(err.response.data.detail);
            }
        },

        onSuccess(data: any) {
            if (data?.data.support_status === 'UNSUPPORTED') {
                setOpenErrorBar(true);
                setError(data?.data.reason);
            }
            setSupportedData(data?.data.support_status);
        },

        onError(error: any) {
            setOpenErrorBar(true);
            setError(error.response.data.detail);
            throw new Error(error.response.data.detail);
        },
    });
    useEffect(() => {
        if (post_data) {
            setSupportedData(post_data.data.support_status);
        }
    }, [post_data]);
    const { mutate: mutate2 } = useMutation({
        mutationFn: () => {
            try {
                return authAxios.post(Enviate_API.POST_VERIFICATION_STATUS_CHECK);
            } catch (err: any) {
                // eslint-disable-next-line no-console
                console.log('err', err);
                setError(err.response.data.detail);
                setOpenErrorBar(true);
                throw new Error(err.response.data.detail);
            }
        },
        onSuccess(data: any) {
            // eslint-disable-next-line no-console
            console.log(data);
            navigation('/dashboard');
        },
        onError(error: any) {
            setOpenErrorBar(true);
            setError(error.response.data.detail);
            throw new Error(error.response.data.detail);
        },
    });
    const handleContinueDashboard = () => {
        mutate2();
    };
    const handleNextCode = (value: any) => {
        const newTopLinkId = verificationCode[activeCodeIndex].top_link_id;

        // Store the value immediately when the button is clicked
        const updatedStoreActiveIndex = [...storeActiveIndex, { top_link_id: newTopLinkId, human_verification: value }];
        setStoreActiveIndex(updatedStoreActiveIndex);

        // Increment the active code index
        if (activeCodeIndex < verificationCode.length - 1) {
            setActiveCodeIndex(activeCodeIndex + 1);
        } else {
            // All steps are completed, trigger the API call
            mutate1(updatedStoreActiveIndex);
        }
    };

    useEffect(() => {
        // This effect will run whenever storeActiveIndex changes
        refetchVerificationCode();
    }, []);

    const scoreResult =
        verificationCode &&
        verificationCode.length > 0 &&
        verificationCode.map((item: any) => {
            switch (item?.human_verification) {
                case 'PASS':
                    return 2;
                case 'FAIL':
                    return 1;
                default:
                    return 0;
            }
        });
    return (
        <StyledAuthContainer>
            <Appbar />
            {openErrorBar && <ErrorBar message={error} setOpen={setOpenErrorBar} />}
            {isLoading ? (
                <LoaderBox>
                    <CircularProgress />
                </LoaderBox>
            ) : (
                <Box>
                    <StyledColumnBox>
                        <StyledHeadingTypography>{authValues.Validate}</StyledHeadingTypography>
                        <StyledContentTypography>{authValues.accountContent1}</StyledContentTypography>
                        <StyledContentTypography>{authValues.accountContent2}</StyledContentTypography>
                    </StyledColumnBox>
                    <StyledColumnBox sx={{ marginTop: '4rem' }}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <StepperComponent
                                handleNextCode={handleNextCode}
                                steps={['1', '2', '3', '4', '5']}
                                stepValues={scoreResult ? scoreResult : []}
                            />
                        </Grid>
                    </StyledColumnBox>
                    <StyledColumnBox sx={{ marginTop: '-5rem' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <StyledRowBox>
                                    <StyledTextBox>
                                        <Typography sx={{ margin: '7px' }}>Project Code </Typography>
                                    </StyledTextBox>
                                    <StyledEditorBox>
                                        <EditorComponent
                                            language='python'
                                            theme='light'
                                            code={verificationCode && verificationCode[activeCodeIndex]?.code_info?.contents}
                                        />
                                    </StyledEditorBox>
                                </StyledRowBox>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                <StyledRowTask>
                                    <StyledTextBox>
                                        <Typography sx={{ margin: '7px' }}>Task Description</Typography>
                                    </StyledTextBox>
                                    <StyledDescriptionBox>
                                        <TaskCard
                                            description={verificationCode && verificationCode[activeCodeIndex]?.requirement_info?.description}
                                        />
                                    </StyledDescriptionBox>
                                </StyledRowTask>
                            </Grid>
                        </Grid>
                    </StyledColumnBox>
                    {(supportedData === 'SUPPORTED' ||
                        supportedData === 'UNSUPPORTED' ||
                        tokenContext.userDetails.linkage_status === 'SUPPORTED' ||
                        tokenContext.userDetails.linkage_status === 'UNSUPPORTED') && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '60px',
                                alignContent: 'center',
                                marginBottom: '4rem',
                                alignItems: 'center',
                            }}>
                            <StyledSubheading alignSelf={'center'} style={{ color: Colors.green }}>
                                Validation Complete!
                            </StyledSubheading>
                            <StyledButton onClick={handleContinueDashboard}>{validateValues.dashboard}</StyledButton>
                        </Box>
                    )}
                </Box>
            )}
            <Footer />
        </StyledAuthContainer>
    );
};
export default HumanValidateScreen;
