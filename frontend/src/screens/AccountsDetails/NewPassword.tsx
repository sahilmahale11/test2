import { Box, Grid } from '@mui/material';
import { StyledButton, StyledContainer, StyledHeading, StyledInputLabel, StyledPaswwordHelperTextStyle, StyledTextField } from './NewPasswordStyles';
import Appbar from '../../components/header/Appbar';
import Footer from '../../components/footer/Footer';

const NewPassword = () => {
    return (
        <Box>
            <Appbar />
            <StyledContainer padding={'15vh 0 21px 10vw'}>
                <StyledHeading>New Password</StyledHeading>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <StyledInputLabel>Email address</StyledInputLabel>
                        <StyledTextField />
                        <StyledInputLabel>Temporary Password</StyledInputLabel>
                        <StyledTextField />
                        <StyledInputLabel>New Password</StyledInputLabel>
                        <StyledTextField />
                        <StyledInputLabel>Confirm Password</StyledInputLabel>
                        <StyledTextField />
                        <StyledButton>Submit</StyledButton>
                    </Grid>

                    <StyledContainer>
                        <StyledPaswwordHelperTextStyle>
                            Password must be a minimum of 6 characters long and contain a minimum of one uppercase, one lowercase, one digit, and one
                            special character.
                        </StyledPaswwordHelperTextStyle>
                    </StyledContainer>
                </Grid>
            </StyledContainer>

            <Footer />
        </Box>
    );
};
export default NewPassword;
