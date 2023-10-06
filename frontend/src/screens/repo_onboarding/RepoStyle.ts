import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Dialog, DialogTitle, Autocomplete } from '@mui/material';
import { Colors, Fonts } from '../../utils/Theme';
// export const ModalContainer = styled(Box)({
//     width: '480px',
//     marginLeft: 'auto',
//     marginRight: 'auto',
//     marginTop: '7%',
//     height: '537px',
//     border: '1px solid #000',
//     backgroundColor: Colors.white,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'space-evenly',
// });
export const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        width: '480px',
        height: '660px',
    },
    '& .MuiDialogContent-root': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
});

export const StyledDialogTitle = styled(DialogTitle)({
    // height: '31.06%',
    height: 'fit-content',
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
    justifyContent: 'center',
    height: '100%',
});

export const CenterContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
});

// export const StyledContainer = styled(Box)({
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     width: '100vw',
// });

export const StyledDialogTitleHeading = styled(Typography)({
    fontFamily: 'Helvetica Neue',
    fontSize: Fonts.mainHeaders,
    fontWeight: 700,
    textAlign: 'center',
    color: Colors.black,
    width: 350,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '6.06%',
});

export const StyledAutoComplete = styled(Autocomplete)({
    width: 287,
    marginBottom: '7vh',
    '& fieldset': {
        // backgroundColor: 'blue',
        height: 50.54,
        justifyContent: 'center',
        display: 'flex',
        top: 0,
    },
});
export const StyledButton = styled(Button)({
    width: '287px',
    height: '28px',
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
    /* Copy 12 */
    fontFamily: 'IBM Plex Mono',
    fontSize: '12px',
    fontWeight: 400,
    marginTop: '8.87%',
    marginBottom: '15.63%',
});
