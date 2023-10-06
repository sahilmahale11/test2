import { useNavigate, Link } from 'react-router-dom';
import { ChangeEvent, useState, useContext, useEffect } from 'react';
import {
    StyledContainer,
    StyledTextField,
    StyledButton,
    LoaderBox,
    StyledHeading,
    StyledlinkMsg,
    Styledmsg,
    StyledHeaderTitle,
    Styledmsg1,
} from './SignupScreenCss';
import { DataContext } from '../../context/DataContext';
import { Box, CircularProgress, Grid } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { fieldValues, errorValues } from '../../utils/constants';
import { userDetails } from '../../interfaces/types';
import { Enviate_API } from '../../utils/endpoints';
import authAxios from '../../service/http-service';
import Appbar from '../../components/header/Appbar';
import Footer from '../../components/footer/Footer';
import ErrorBar from '../../components/error/ErrorBar';
const SignupScreen = () => {
    const [userDetails, setUserDetails] = useState<userDetails>({
        password: '',
        confirmPassword: '',
        email: '',
        first_name: '',
        last_name: '',
        organization: '',
    });
    const navigation = useNavigate();
    const [disabled, setDisabled] = useState(true);
    const authContext = useContext(DataContext);
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
        email: '',
        first_name: '',
        last_name: '',
        organization: '',
    });
    const [responseError, setResponseError] = useState('');
    const [openErrorBar, setOpenErrorBar] = useState(false);

    const { mutate, isLoading, isError } = useMutation({
        mutationFn: (newUser: userDetails) => {
            try {
                const cleanUserDetails = {
                    password: newUser.password,
                    email: newUser.email,
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    organization: newUser.organization,
                };
                return authAxios.post(Enviate_API.SIGNUP, cleanUserDetails);
                // Handle the response as needed
            } catch (err: any) {
                // eslint-disable-next-line no-console
                console.log('err', err);
                throw new Error('something went wrong');
            }
        },
        onSuccess: (data) => {
            authContext.updateData(data.data);
            setDisabled(true);
            setUserDetails({
                password: '',
                confirmPassword: '',
                email: '',
                first_name: '',
                last_name: '',
                organization: '',
            });
            if (!disabled) {
                navigation('/auth');
            }
        },
        onError(error: any) {
            // eslint-disable-next-line no-console
            console.log('error', error, userDetails);
            setDisabled(true);
            setUserDetails((prev) => ({
                ...prev,
                password: '', // Set the password field to an empty string
            }));

            // setResponseError('incorecct Details');
            setResponseError(error.response.data.detail);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!disabled) {
            mutate(userDetails);
        }
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const validate = (name: string, value: any) => {
        const newErrors = errors;
        let error = false;
        switch (name) {
            case fieldValues.email:
                if (!value || value.trim() === '') {
                    newErrors.email = errorValues.emailRequired;
                    error = true;
                } else {
                    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    const emailvalidate = emailRegex.test(userDetails.email);
                    if (!emailvalidate) {
                        newErrors.email = errorValues.validEmail;
                        error = true;
                    }
                }
                break;
            case fieldValues.password:
                if (!value || value.trim() === '') {
                    newErrors.password = errorValues.passwordRequired;
                    error = true;
                } else if (userDetails.password.length < 6) {
                    newErrors.password = errorValues.passwordRequired;
                    error = true;
                }
                break;
            case fieldValues.confirmPassword:
                if (value !== userDetails.password) {
                    // Compare with the password field
                    newErrors.confirmPassword = errorValues.passwordMismatch;
                    error = true;
                } else {
                    newErrors.confirmPassword = ''; // Clear the error message if no error
                }
                break;
            case fieldValues.firstName:
                if (value.trim() === '') {
                    newErrors.first_name = errorValues.firstNameRequired;
                    error = true;
                }
                break;
            case fieldValues.lastName:
                if (value.trim() === '') {
                    newErrors.last_name = errorValues.lastNameRequired;
                    error = true;
                }
                break;
            case fieldValues.organization:
                if (value.trim() === '') {
                    newErrors.organization = errorValues.organizationRequired;
                    error = true;
                }
                break;
            default:
                break;
        }
        if (error) {
            setErrors((prev) => ({ ...prev, ...newErrors }));
        }
        if (!error) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };
    useEffect(() => {
        // Check if both email and password errors are empty to enable the button
        if (
            errors.email.trim() === '' &&
            errors.password.trim() === '' &&
            errors.first_name.trim() === '' &&
            errors.last_name.trim() === '' &&
            errors.confirmPassword.trim() === '' &&
            userDetails.email.trim() !== '' &&
            userDetails.password.trim() !== '' &&
            userDetails.first_name.trim() !== '' &&
            userDetails.last_name.trim() !== '' &&
            userDetails.confirmPassword.trim() !== ''
        ) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [errors]);

    const validateFields = () => {
        validate(fieldValues.password, userDetails.password);
        validate(fieldValues.confirmPassword, userDetails.confirmPassword);
        validate(fieldValues.email, userDetails.email);
        validate(fieldValues.firstName, userDetails.first_name);
        validate(fieldValues.lastName, userDetails.last_name);

        if (
            errors.email.trim() === '' &&
            errors.password.trim() === '' &&
            errors.first_name.trim() === '' &&
            errors.last_name.trim() === '' &&
            userDetails.email.trim() !== '' &&
            userDetails.password.trim() !== '' &&
            userDetails.first_name.trim() !== '' &&
            userDetails.last_name.trim() !== '' &&
            userDetails.password.trim() !== '' &&
            userDetails.confirmPassword.trim() !== ''
        ) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };

    useEffect(() => {
        if (isError) {
            setOpenErrorBar(true);
        } else if (!isError) {
            setOpenErrorBar(false);
        }
    }, [isError]);

    if (isLoading) {
        return (
            <LoaderBox>
                <CircularProgress />
            </LoaderBox>
        );
    }
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
            <Appbar />
            {openErrorBar && <ErrorBar message={responseError} setOpen={setOpenErrorBar} />}
            <StyledContainer>
                <StyledHeaderTitle>Sign Up</StyledHeaderTitle>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <StyledHeading>Email Address *</StyledHeading>
                        <StyledTextField
                            value={userDetails.email}
                            name={fieldValues.email}
                            onChange={handleChange}
                            placeholder='Email'
                            onBlur={() => {
                                validate(fieldValues.email, userDetails.email);
                            }}
                            variant='outlined'
                            error={errors.email.trim() !== ''}
                            helperText={errors.email}
                        />
                        <StyledHeading>First Name *</StyledHeading>
                        <StyledTextField
                            value={userDetails.first_name}
                            name={fieldValues.firstName}
                            onChange={handleChange}
                            placeholder='First Name'
                            onBlur={() => validate(fieldValues.firstName, userDetails.first_name)}
                            variant='outlined'
                            error={errors.first_name.trim() !== ''}
                            helperText={errors.first_name}
                        />
                        <StyledHeading>Last Name *</StyledHeading>
                        <StyledTextField
                            value={userDetails.last_name}
                            name={fieldValues.lastName}
                            onChange={handleChange}
                            placeholder='Last Name'
                            onBlur={() => validate(fieldValues.lastName, userDetails.last_name)}
                            variant='outlined'
                            error={errors.last_name.trim() !== ''}
                            helperText={errors.last_name}
                        />
                        <StyledHeading>Organization</StyledHeading>
                        <StyledTextField
                            value={userDetails.organization}
                            name={fieldValues.organization}
                            onChange={handleChange}
                            placeholder='Organization'
                            variant='outlined'
                            error={errors.organization.trim() !== ''}
                            helperText={errors.organization}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <StyledHeading>Create Password *</StyledHeading>
                        <StyledTextField
                            value={userDetails.password}
                            name={fieldValues.password}
                            onChange={handleChange}
                            onBlur={() => validate(fieldValues.password, userDetails.password)}
                            variant='outlined'
                            type='password'
                            error={errors.password.trim() !== ''}
                        />
                        <StyledHeading>Confirm Password *</StyledHeading>
                        <StyledTextField
                            value={userDetails.confirmPassword}
                            name={fieldValues.confirmPassword}
                            onChange={handleChange}
                            onBlur={() => validate(fieldValues.confirmPassword, userDetails.confirmPassword)}
                            variant='outlined'
                            type='password'
                            error={errors.confirmPassword.trim() !== ''}
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
                                By submitting this form, you agree to our
                                <br />
                                <Link to={''}> Data Policy </Link> and <Link to={''}> Terms and Conditions</Link>
                            </StyledlinkMsg>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <Styledmsg1>{errorValues.passwordRequired}</Styledmsg1>
                        {errors.confirmPassword && <Styledmsg>{errors.confirmPassword}</Styledmsg>}
                    </Grid>
                </Grid>
            </StyledContainer>
            <Footer />
        </Box>
    );
};
export default SignupScreen;
