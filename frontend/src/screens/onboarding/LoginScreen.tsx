import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { Box, CircularProgress, DialogContent, DialogTitle } from '@mui/material';
// import { LoaderBox } from '../../screens/onboarding/FormStyles';
import { Enviate_API } from '../../utils/endpoints';
import {
    StyledContainer,
    StyledButton,
    StyledTextField,
    // LoaderBox,
    StyledInputLabel,
    StyledDialog,
    StyledHeading,
    StyledButtonText,
    StyledLink,
} from './LoginScreenStyles';
import { fieldValues, errorValues, loginValues } from '../../utils/constants';
import { useMutation } from '@tanstack/react-query';
import authAxios from '../../service/http-service';
import { loginDetails } from '../../interfaces/types';
import CrossIcon from '../../assets/CrossIcon';

interface LoginPageProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

function LoginPage({ open = false, setOpen }: LoginPageProps) {
    const [disabled, setDisabled] = useState(true);
    const authContext = useContext(DataContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseError, setResponseError] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const navigation = useNavigate();

    const { mutate, isLoading, isError, reset } = useMutation({
        mutationFn: (oldUser: loginDetails) => {
            try {
                return authAxios.post(Enviate_API.LOGIN, oldUser);
            } catch (err: any) {
                // eslint-disable-next-line no-console
                console.log('err', err);
                throw new Error('something went wrong');
            }
        },
        onSuccess(data: any) {
            authContext.updateData(data.data);
            setDisabled(true);
            setEmail('');
            setPassword('');
            if (data.data.github_authorized) {
                window.location.href = Enviate_API.GITHUB_INTEGRATE_URL;
            } else {
                if (!disabled) {
                    navigation('/auth');
                    setOpen(false);
                }
            }
        },
        onError(error: any) {
            // eslint-disable-next-line no-console
            console.log('error', error, disabled, email, password);
            setDisabled(true);
            setPassword('');

            setResponseError(error.response.data.detail);
        },
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!disabled) {
            mutate({ email, password });
        }
    };
    useEffect(() => {
        // Check if both email and password errors are empty to enable the button
        if (errors.email.trim() === '' && errors.password.trim() === '' && email.trim() !== '' && password.trim() !== '' && open === true) {
            // open true has been added to avoid it from getting not disabled when this dialog is closed (it wont be required if you dont need to reset the error messages on closing this dialog)
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [errors]);

    useEffect(() => {
        if (!open) {
            reset();
            setErrors({
                email: '',
                password: '',
            });
        }
    }, [open]);
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
                    const emailvalidate = emailRegex.test(email);
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
                } else if (value.length < 6) {
                    newErrors.password = errorValues.longPassword;
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
    const validateFields = () => {
        validate(fieldValues.email, email);
        validate(fieldValues.password, password);
        if (errors.email.trim() === '' && errors.password.trim() === '' && email.trim() !== '' && password.trim() !== '') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };
    // if (isLoading) {
    //     return (
    //         <LoaderBox>
    //             <CircularProgress />
    //         </LoaderBox>
    //     );
    // }
    return (
        <Box>
            <StyledDialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle sx={{ padding: '0px' }}>
                    <StyledHeading>
                        Login
                        <CrossIcon onClick={() => setOpen(false)} />
                    </StyledHeading>
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        '& .MuiDialogContent-root': {
                            backgroundColor: 'blue',
                        },
                    }}>
                    <StyledContainer>
                        <StyledInputLabel>{loginValues.emailAddress} *</StyledInputLabel>
                        <StyledTextField
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            onBlur={() => validate(fieldValues.email, email)}
                            error={errors.email.trim() !== ''}
                            helperText={errors.email}
                            variant='outlined'
                        />
                        <StyledInputLabel>{loginValues.password} *</StyledInputLabel>
                        <StyledTextField
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            id='filled-error-helper-text'
                            onBlur={() => {
                                validate(fieldValues.password, password);
                            }}
                            variant='outlined'
                            error={isError || errors.password.trim() !== ''} // Set error to true when there's an error or isError is true
                            helperText={isError ? responseError : errors.password}
                            type='password'
                        />

                        <StyledButton
                            variant='contained'
                            onClick={(e) => {
                                validateFields();
                                handleSubmit(e);
                            }}>
                            <StyledButtonText>{loginValues.submit}</StyledButtonText>
                            {isLoading ? <CircularProgress size={'1.2rem'} sx={{ marginLeft: '1rem' }} /> : ''}
                        </StyledButton>
                        <Link
                            to='#'
                            onClick={() => {
                                setOpen(false);
                            }}
                            style={{ marginBottom: '3rem' }}>
                            <StyledLink>{loginValues.forgotPassword}</StyledLink>
                        </Link>
                    </StyledContainer>
                </DialogContent>
            </StyledDialog>
        </Box>
    );
}

export default LoginPage;
