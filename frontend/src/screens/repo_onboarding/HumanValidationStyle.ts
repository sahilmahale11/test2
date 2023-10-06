import { styled } from '@mui/material/styles';
import { Button, Typography, Box } from '@mui/material';
import { Colors, Fonts } from '../../utils/Theme';
export const StyledAuthContainer = styled(Box)({
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'space-between',
});
export const StyledColumnBox = styled(Box)({
    width: '85%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
});
export const StyledHeadingTypography = styled(Typography)({
    fontFamily: 'Helvetica Neue',
    fontSize: Fonts.mainHeaders,
    fontWeight: 700,
    color: Colors.black,
    fontStyle: 'normal',
    lineHeight: 'normal',
    marginTop: '7vh',
});
export const StyledContentTypography = styled(Typography)({
    fontSize: Fonts.standardButtons,
    fontWeight: 700,
    marginTop: '1rem',
    fontFamily: 'Helvetica Neue',
    color: Colors.courtGreen,
    fontStyle: 'normal',
    lineHeight: 'normal',
});
export const StyledRowBox = styled(Box)(({}) => ({
    border: '1px solid',
    width: '90%',
    marginLeft: 'auto',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: '10rem',
    marginRight: 'auto',
    marginBottom: '2.25rem',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: '#F6F5F8',
}));
export const StyledTextBox = styled(Box)({
    padding: '0px 12px',
    width: '100%',
    height: '100%',
    border: '1px solid #000',
    margin: '10px',
});
export const StyledDescriptionBox = styled(Box)({
    padding: '0px 12px',
    width: '100%',
    height: '100%',
    border: '1px solid #000',
    margin: '10px',
    overflowY: 'auto',
    backgroundColor: 'white',
});

export const StyledEditorBox = styled(Box)({
    padding: '0px 12px',
    width: '100%',
    height: '100%',
    border: '1px solid #000',
    margin: '10px',
    backgroundColor: 'white',
});
export const StyledRowTask = styled(Box)(({}) => ({
    border: '1px solid',
    backgroundColor: '#F6F5F8',
    width: '90%',
    marginLeft: 'auto',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: '10rem',
    marginRight: 'auto',
    marginBottom: '2.25rem',
    cursor: 'pointer',
    alignItems: 'center',
    display: 'flex',
}));
export const StyledBox = styled(Box)({
    width: '17rem',
    height: '14rem',
    strokeWidth: '1px',
    cursor: 'pointer',
    border: '1px solid black',
});
export const StyledButton = styled(Button)({
    width: '19rem',
    height: '72px',
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
export const StyledTypography = styled(Typography)({
    fontFamily: 'Helvetica Neue',
    fontSize: '24px',
    fontWeight: 700,
    textAlign: 'center',
    color: Colors.lightBlack,
    width: 350,
    marginLeft: 'auto',
    marginRight: 'auto',
});
export const StyledSubmitButton = styled(Button)({
    justifyContent: 'center',
    display: 'flex',
    margin: '10px',
    cursor: 'pointer',
});
export const CenterContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
});
