import { StyledButton, StyledContainer, StyledContentBox, StyledContentTypography, StyledHeading, StyledSubheading } from './EnviateAnalysisStyles';
import { Colors } from '../../utils/Theme';
import { authValues, enviateAnalysisValues } from '../../utils/constants';
import { useContext, useEffect, useState } from 'react';
import Appbar from '../../components/header/Appbar';
import Footer from '../../components/footer/Footer';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import { useQuery } from '@tanstack/react-query';
import authAxios from '../../service/http-service';
import { Enviate_API } from '../../utils/endpoints';
import { LoaderBox } from '../onboarding/SignupScreenCss';
import ErrorBar from '../../components/error/ErrorBar';
const EnviateAnalysis = () => {
    const navigate = useNavigate();
    const { userDetails, updateData } = useContext(DataContext);
    const [openErrorBar, setOpenErrorBar] = useState(false);
    const [responseError, setResponseError] = useState('');
    // Ensure that userDetails is defined before accessing linkage_status
    const linkageStatus: string = userDetails?.linkage_status || '';

    const {
        data: repo_data,
        isLoading,
        isError,
        refetch: refetch_status,
    } = useQuery({
        queryKey: ['get_analysis'],
        queryFn: async () => {
            try {
                const res = await authAxios.get(Enviate_API.GET_BEGIN_ANALYSIS);
                const data = await res.data;
                return data;
            } catch (err: any) {
                // Handle loading error and set loadingError to true
                setOpenErrorBar(true);
                setResponseError(err.response?.data?.detail);
                throw new Error(err.response?.data?.detail || 'An error occurred during analysis');
            }
        },
        onSuccess(data) {
            if (data?.linkage_status === 'FAILED') {
                setOpenErrorBar(true);
                setResponseError(data?.reason);
            }
        },
        retry: false, // Retry up to 3 times if there's an error
        staleTime: Infinity,
        retryOnMount: true, // Retry when the component mounts
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    const handleButton = () => {
        if (!isError && repo_data) {
            const newDetails = userDetails;
            newDetails.linkage_status = repo_data.linkage_status;
            updateData(newDetails);
        }
        navigate('/validate');
    };

    useEffect(() => {
        refetch_status();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}>
            <Appbar />
            {openErrorBar && <ErrorBar setOpen={setOpenErrorBar} message={responseError} />}
            {isLoading ? (
                <LoaderBox>
                    <CircularProgress />
                </LoaderBox>
            ) : (
                <StyledContainer>
                    <StyledHeading sx={{ color: Colors.lightBlack }}>{enviateAnalysisValues.analsisInProgress}</StyledHeading>
                    <StyledSubheading>
                        <StyledContentTypography>{authValues.accountContent1}</StyledContentTypography>
                        <StyledContentTypography>{authValues.accountContent2}</StyledContentTypography>
                    </StyledSubheading>
                    <StyledContentBox></StyledContentBox>
                    <StyledSubheading sx={{ color: Colors.lightBlack, height: '78px' }}>
                        <Typography sx={{ color: 'black', display: 'inline-flex' }}>*</Typography> {enviateAnalysisValues.analysisSubHeader}
                    </StyledSubheading>
                    {(linkageStatus === 'AWAITING_VALIDATION' || repo_data?.linkage_status === 'AWAITING_VALIDATION') && (
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
                                Analysis Complete!
                            </StyledSubheading>
                            <StyledButton onClick={handleButton}>{enviateAnalysisValues.continueToValidation}</StyledButton>
                        </Box>
                    )}
                    {(linkageStatus === 'FAILED' || repo_data?.linkage_status === 'FAILED') && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                                marginBottom: '4rem',
                                alignItems: 'center',
                            }}>
                            <StyledSubheading alignSelf={'center'} style={{ color: Colors.red }}>
                                Analysis Failed!
                            </StyledSubheading>
                        </Box>
                    )}
                </StyledContainer>
            )}
            <Footer />
        </Box>
    );
};

export default EnviateAnalysis;
