import { Box, CircularProgress, Grid } from '@mui/material';
import { StledLinkStatus, StyledContainer, StyledHeader, StyledHeader2, StyledLink, StyledUserData } from './AccountInfoStyles';
import Appbar from '../../components/header/Appbar';
import Footer from '../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../context/DataContext';
import { useQuery } from '@tanstack/react-query';
import authAxios from '../../service/http-service';
import { Enviate_API } from '../../utils/endpoints';
import { LoaderBox } from '../onboarding/SignupScreenCss';
import ErrorBar from '../../components/error/ErrorBar';

const AccountInfo = () => {
    const navigate = useNavigate();
    const { updateData } = useContext(DataContext);
    const [openErrorBar, setOpenErrorBar] = useState(false);
    const [error, setError] = useState('');
    const handleLogOut = () => {
        // Clear local storage and navigate to the sign-up page
        updateData({
            token: '', // Clear the token
            token_type: '',
            jira_authorized: false,
            github_authorized: false,
            linkage_status: '',
        });
        localStorage.clear();
        navigate('/home');
    };

    const {
        refetch: refetchProfileData,
        data: profileData,
        isLoading,
    } = useQuery({
        enabled: true, // Fetch data immediately
        queryKey: ['profile_data'],
        queryFn: async () => {
            try {
                const response = await authAxios.get(Enviate_API.PROFILE_DATA);
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

    useEffect(() => {
        refetchProfileData();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Appbar />
            {openErrorBar && <ErrorBar message={error} setOpen={setOpenErrorBar} />}
            {isLoading ? (
                <LoaderBox>
                    <CircularProgress />
                </LoaderBox>
            ) : (
                <StyledContainer>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <StyledHeader>Profile</StyledHeader>
                            <StyledUserData>
                                {profileData?.first_name} {profileData?.last_name}
                            </StyledUserData>
                            <StyledUserData>{profileData?.organization && profileData?.organization}</StyledUserData>

                            <StyledHeader2>Log Out</StyledHeader2>
                            <StyledLink onClick={handleLogOut}>Log Out Of Enviate</StyledLink>

                            <Box>
                                <StyledHeader2>Account Integrations</StyledHeader2>
                                <Grid container>
                                    <StyledUserData>Github</StyledUserData>
                                    <StledLinkStatus sx={{ marginLeft: '54px' }}>
                                        {profileData?.github_authorized ? 'Connected' : 'Not Connected'}
                                    </StledLinkStatus>
                                </Grid>
                                <Grid container>
                                    <StyledUserData>Jira</StyledUserData>
                                    <StledLinkStatus sx={{ marginLeft: '70px' }}>
                                        {profileData?.jira_authorized ? 'Connected' : 'Not Connected'}
                                    </StledLinkStatus>
                                </Grid>
                            </Box>
                        </Grid>
                        {/* <Grid item xs={6} sm={6}>
                    <StyledTitle sx={{ fontSize: '36px' }}>Change Password</StyledTitle>

                    <StyledUserData >Email Address</StyledUserData>
                    <StyledTextField
                        value={userDetails.password}
                        name={fieldValues.password}
                        onChange={handleChange}
                        onBlur={() => validate(fieldValues.password, userDetails.password)}
                        variant='outlined'
                        type='password'
                        error={errors.password.trim() !== ''}
                        helperText={errors.password}
                    />

                    <Grid>
                        <StyledButton
                            onClick={(e) => {
                                validateFields();
                                handleSubmit(e);
                            }}>
                            Submit
                        </StyledButton>
                        <StyledlinkMsg>
                            If an account associated with this email exists, <br />
                            you will be mailed a new temporary password.
                        </StyledlinkMsg>
                        <StyledTitle sx={{ marginTop: '34px', fontSize: '36px' }}>Delete Account</StyledTitle>
                        <StyledButton sx={{ marginTop: '6px' }} onClick={(e) => {}}>
                            Delete
                        </StyledButton>
                    </Grid>
                </Grid> */}
                    </Grid>
                </StyledContainer>
            )}
            <Footer />
        </Box>
    );
};
export default AccountInfo;
