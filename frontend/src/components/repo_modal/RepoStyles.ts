import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Dialog, DialogTitle, Autocomplete } from '@mui/material';
import { Colors, Fonts } from '../../utils/Theme';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '480px',
        [theme.breakpoints.between('sm', 'md')]: {
            height: '80%',
        },
        height: '660px',
    },

    '& .MuiDialogContent-root': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
    },
}));

export const StyledDialogTitle = styled(DialogTitle)({
    height: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: '7.42%',
    paddingBottom: 0,
});

export const StyledDialogContent = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    marginTop: '2rem',
    justifyContent: 'space-around',
});

export const StyledDialogTitleHeading = styled(Typography)({
    fontFamily: 'Helvetica Neue',
    fontSize: Fonts.mainHeaders,
    fontWeight: 700,
    color: Colors.black,
    textAlign: 'center',
    width: 350,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '6.06%',
});
export const StyledTooltipText = styled(Typography)({
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.copySectionHeaders,
    fontWeight: 400,
    color: Colors.black,
    fontStyle: 'normal',
    lineHeight: 'normal',
    margin: '1em 2em 2em 2em',
});

export const StyledAutoComplete = styled(Autocomplete)({
    width: 287,
    marginBottom: '2rem',

    '& fieldset': {
        height: 50.54,
        justifyContent: 'center',
        display: 'flex',
        top: 0,
    },
});

export const StyledButton = styled(Button)({
    width: '287px',
    height: '28px',
    marginBottom: '2rem',
    borderRadius: '6px',
    backgroundColor: Colors.lightGrey,
    color: Colors.lightBlack,
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.subHeaders,
    fontWeight: 700,
    cursor: 'pointer',
    textTransform: 'none',

    '&:disabled': {
        backgroundColor: Colors.green,
        color: Colors.lightGrey,
    },

    '&:hover': {
        backgroundColor: Colors.lightGrey,
    },

    '&.Mui-disabled': {
        backgroundColor: Colors.green,
        color: Colors.lightGrey,
    },
});

export const StyledSubTypo = styled(Typography)({
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'IBM Plex Mono',
    fontSize: '12px',
    fontWeight: 400,
    marginTop: '8.87%',
    marginBottom: '15.63%',
});
