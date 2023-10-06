import { StyledContainer, StyledButton } from './FormStyles';
import { Typography, CssBaseline, Box, Toolbar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Appbar from '../../components/header/Appbar';
import ErrorBar from '../../components/error/ErrorBar';
import Footer from '../../components/footer/Footer';
const HomeScreenDummy = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { message } = location.state || '';
    const [open, setOpen] = useState(message ? true : false);
    return (
        <Box
            sx={{
                flexDirection: 'column',
                display: 'flex',
                minHeight: '100vh', // Set a minimum height to fill the screen
            }}>
            <CssBaseline />
            <Appbar />
            {open && <ErrorBar setOpen={() => setOpen(false)} message={message} />}
            <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <StyledContainer sx={{ marginTop: 2 }}>
                    <Typography variant='h4'>Welcome to Enviate</Typography>
                    <StyledButton
                        variant='contained'
                        onClick={() => {
                            localStorage.clear();
                            navigate('/signUp');
                        }}>
                        Sign Up
                    </StyledButton>
                </StyledContainer>
            </Box>
            <Footer />
        </Box>
    );
};

export default HomeScreenDummy;
