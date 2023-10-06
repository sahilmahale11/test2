import { AppBar, Box, Toolbar } from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import EnviLogo from '../../assets/Enviatelogo';
import { StyledBox, StyledHeaderContainer, StyledLink, StyledText, StyledColumnBox } from './HeaderStyles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Colors } from '../../utils/Theme';
import { headerValues } from '../../utils/constants';
import LoginPage from '../../screens/onboarding/LoginScreen';
function Appbar() {
    const authContext = useContext(DataContext);
    const navigate = useNavigate();
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

    // Function to open the login dialog
    const openLoginDialog = () => {
        setIsLoginDialogOpen(true);
    };

    return (
        <Box>
            <AppBar position='sticky' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: Colors.lightBlack }}>
                <Toolbar>
                    <StyledHeaderContainer>
                        <StyledBox>
                            <StyledLink to='/home'>
                                <EnviLogo />
                            </StyledLink>
                        </StyledBox>
                        <StyledBox>
                            <StyledLink to=''>{headerValues.about}</StyledLink>
                            <StyledLink to='' sx={{ marginLeft: '0.5rem', marginRight: '0.5rem', fontSize: '18px', textDecoration: 'none' }}>
                                |
                            </StyledLink>
                            <StyledLink to=''>{headerValues.support}</StyledLink>
                            <StyledColumnBox
                                onClick={() => {
                                    // Check if the user is authenticated and open the login dialog if not
                                    if (!authContext.isAuthenticated()) {
                                        openLoginDialog();
                                    } else {
                                        navigate('/accountInfo');
                                    }
                                }}>
                                <AccountCircleIcon fontSize='large' />
                                <StyledText>{authContext.isAuthenticated() ? headerValues.profile : headerValues.login}</StyledText>
                            </StyledColumnBox>
                        </StyledBox>
                    </StyledHeaderContainer>
                </Toolbar>
            </AppBar>

            {/* Render the LoginDialog component with the closeLoginDialog function */}
            <LoginPage open={isLoginDialogOpen} setOpen={setIsLoginDialogOpen} />
        </Box>
    );
}

export default Appbar;
