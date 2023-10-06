import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Colors, Fonts } from '../../utils/Theme';
export const StyledFooterContainer = styled(Box)({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.lightBlack,
});
export const StyledFooterColumnBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '60px',
    marginTop: '40px',
    marginBottom: '40px',
    alignItems: 'flex-start',
    justifyContent: 'center',
});
export const StyledRowBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
});
export const StyledTypography = styled(Typography)({
    fontSize: Fonts.standardButtons,
    fontFamily: 'Helvetica Neue',
    color: Colors.lightWhite,
    fontStyle: 'normal',
    lineHeight: 'normal',
});
export const StyledProductUpdateTypography = styled(Typography)({
    fontSize: Fonts.copySectionHeaders,
    fontFamily: 'IBM Plex Mono',
    color: Colors.white,
    fontWeight: 400,
    fontStyle: 'normal',
    lineHeight: 'normal',
});
export const StyledTextField = styled(TextField)({
    borderRadius: '6px',
    width: '17rem',
    height: '28px',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    outline: 'none',
    backgroundColor: Colors.white,
    '&:hover': {
        border: 'none',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: 'none',
            outline: 'none', // Remove the border color
        },
        '&:hover fieldset': {
            border: 'none',
            outline: 'none', // Remove the border color on hover
        },
    },
});
export const StyledButton = styled(Button)({
    margin: 0,
    position: 'absolute',
    right: 0,
    display: 'flex',
    width: '50px',
    height: '26px',
    border: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0px 6px 6px 0px',
    backgroundColor: Colors.courtGreen,
    '&:hover': {
        backgroundColor: Colors.courtGreen, // Set the background color to whatever you want for disabled hover state
        color: 'inherit', // Set the text color to whatever you want for disabled hover state
        boxShadow: 'none',
        height: '28px', // Remove any hover box shadow
        // Add any other styles you want to remove on hover
    },
});
