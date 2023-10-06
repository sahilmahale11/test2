import { styled } from '@mui/material/styles';
import { Fonts, Colors } from '../../utils/Theme';
import { Box, TextField, Button, Link, Typography } from '@mui/material';
export const StyledContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    // marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
});

export const StyledHeading = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: Fonts.mainHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        marginBottom: '4.33%',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: Fonts.mainHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        marginBottom: '15px',
    },
}));

export const StyledInputLabel = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: Fonts.copySectionHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: Fonts.copySectionHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        marginTop: '3.8%',
        marginBottom: '1.83%',
    },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        '& .MuiInputBase-root': {
            height: '28px',
            width: '287px',
            // border: '1px solid #000000',
        },
        '& fieldset': {
            border: '1px solid #000000',
        },
        '& *': {
            padding: '0px',
        },
    },

    [theme.breakpoints.up('sm')]: {
        width: 350,
        '& .MuiInputBase-root': {
            height: '28px',
            width: '287px',
            // border: '1px solid #000000',
        },
        '& fieldset': {
            border: '1px solid #000000',
        },
        '& *': {
            padding: '0px',
        },
    },
}));

export const StyledPaswwordHelperTextStyle = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        marginTop: '88px',
        maxWidth: '313px',
        height: '64px',
        color: Colors.black,
        fontFamily: 'IBM Plex Mono',
        fontSize: Fonts.copyButtons,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'normal',
    },
    [theme.breakpoints.up('sm')]: {
        marginTop: '88px',
        maxWidth: '313px',
        height: '64px',
        color: Colors.black,
        fontFamily: 'IBM Plex Mono',
        fontSize: Fonts.copyButtons,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'normal',
    },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: '10%',
    marginBottom: 10,
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.copySectionHeaders,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    color: Colors.black,
    backgroundColor: Colors.lightGrey,
    width: '287px',
    height: '28px',
    '&.disabled': {
        backgroundColor: theme.palette.secondary.main,
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
});
