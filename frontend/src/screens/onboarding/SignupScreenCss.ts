import { styled } from '@mui/material/styles';
import { Box, TextField, Button, Link, Typography } from '@mui/material';
import { Colors, Fonts } from '../../utils/Theme';
export const StyledContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    width: '85%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '36px',
    marginBottom: '123px',
});

export const StyledPaswwordHelperTextStyle = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        color: Colors.black,
        fontFamily: 'IBM Plex Mono',
        fontSize: Fonts.copyButtons,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'normal',
    },
    [theme.breakpoints.up('sm')]: {
        color: Colors.black,
        fontFamily: 'IBM Plex Mono',
        fontSize: Fonts.copyButtons,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'normal',
    },
}));
export const StyledTextField = styled(TextField)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginTop: 15,
    },

    [theme.breakpoints.up('sm')]: {
        width: 350,
        marginTop: 15,
    },
    [theme.breakpoints.between('md', 'lg')]: {
        width: '260px', // Adjust the width as per your requirements
    },
    height: '28px',
    width: '287px',
    marginTop: '15px',

    '& .MuiInputBase-input': {
        padding: '8.5px 14px',
    },
}));
export const StyledDetailField = styled(TextField)(({}) => ({
    height: '3px',
    width: '187px',
    marginTop: '15px',
    '& .MuiInputBase-input': {
        padding: '1.5px 14px',
    },
}));
export const StyledTitle = styled(Typography)(({}) => ({
    color: Colors.black,
    fontSize: Fonts.standardButtons,
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
}));
export const StyledHeaderTitle = styled(Typography)(({}) => ({
    color: Colors.black,

    fontFamily: 'Helvetica Neue',
    fontSize: Fonts.mainHeaders,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
}));
export const StyledHeading = styled(Typography)(({}) => ({
    color: Colors.black,
    fontFamily: ' Helvetica Neue',
    fontSize: Fonts.standardButtons,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    marginTop: '38px',
}));

export const StyledlinkMsg = styled(Typography)(({}) => ({
    color: Colors.lightBlack,
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.copyButtons,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
    marginTop: '13px',
}));

export const Styledmsg = styled(Typography)(({}) => ({
    marginTop: '65px',
    color: Colors.red,
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.copyButtons,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
}));
export const Styledmsg1 = styled(Typography)(({}) => ({
    marginTop: '63px',
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.copyButtons,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
    height: '43px',
    maxHeight: '64px',
    maxWidth: '399px',
}));
export const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: '12%',
    marginBottom: 2,
    width: '348px',
    height: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px',
    color: Colors.lightBlack,
    textTransform: 'none',
    backgroundColor: '#D3D8D4',
    // '&.disabled': {
    //     backgroundColor: theme.palette.secondary.main,
    // },
    [theme.breakpoints.between('md', 'lg')]: {
        width: '260px', // Adjust the width as per your requirements
    },
    '&:hover': {
        // Use &:hover to specify the hover state
        backgroundColor: '#D3D8D4',
        color: Colors.lightBlack,
    },
}));

export const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
});

export const LoaderBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
});
