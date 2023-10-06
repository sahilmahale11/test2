import { styled } from '@mui/material/styles';
import { Fonts, Colors } from '../../utils/Theme';
import { Box, TextField, Button, Typography, Dialog } from '@mui/material';
export const StyledContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    overflow: 'hidden',
});

export const StyledDialog = styled(Dialog)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        '& .MuiDialog-paper': {
            width: '480px',
            height: '470px',
        },
        '& .MuiDialogContent-root': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
        },
    },
    [theme.breakpoints.up('sm')]: {
        '& .MuiDialog-paper': {
            width: '480px',
            height: '470px',
        },
        '& .MuiDialogContent-root': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
        },
    },
}));

export const StyledHeading = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: Fonts.mainHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        marginTop: '14.46%',
        marginLeft: '20.14%',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: Fonts.mainHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        marginTop: '14.46%',
        marginLeft: '19.14%',
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

export const StyledInputLabel = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: Fonts.copySectionHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        marginTop: '6.59%',
        marginBottom: '2.76%',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: Fonts.copySectionHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        marginTop: '6.59%',
        marginBottom: '2.76%',
    },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        '& .MuiInputBase-root': {
            height: '28px',
            width: '287px',
            // border: '1px solid #000000',
        },
        '& fieldset': {
            border: '1px solid #000000',
        },
        '& span': {
            padding: '0px',
            FontSize: '12px',
            backgroundColor: Colors.black,
        },
        '& p': {
            Colors: 'blue',
        },
        '& *': {
            padding: '0px',
        },
    },

    [theme.breakpoints.up('sm')]: {
        // backgroundColor: Colors.black,
        '& .MuiInputBase-root': {
            fontSize: Fonts.copySectionHeaders,
            paddingLeft: '0.5rem',
            height: '28px',
            width: '287px',
        },
        '& input': {
            padding: '0px',
            FontSize: '12px',
            // backgroundColor: Colors.black,
        },
        '& fieldset': {
            border: '1px solid #000000',
        },
        '& *': {
            padding: '0px',
        },
        '&  .MuiFormHelperText-root': {
            color: 'blue',
            width: '287px',
            margin: 0,
        },
    },
}));

export const StyledPaswwordHelperTextStyle = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        marginTop: '350px',
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
        marginTop: '350px',
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
    marginTop: '18%',
    marginBottom: 10,

    backgroundColor: Colors.lightGrey,
    width: '287px',
    height: '28px',
    '&.disabled': {
        backgroundColor: theme.palette.secondary.main,
    },
    '&:hover': {
        backgroundColor: Colors.lightGrey,
    },
}));

export const StyledButtonText = styled(Typography)(() => ({
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.copyButtons,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    color: Colors.black,
    textTransform: 'none',
}));

export const StyledLink = styled(Typography)({
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.copyButtons,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
    color: Colors.black,
});

export const LoaderBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
