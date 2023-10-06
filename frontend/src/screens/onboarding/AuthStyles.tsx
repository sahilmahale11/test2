import { styled } from '@mui/material/styles';
import { Button, Typography, Box } from '@mui/material';
import { Colors, Fonts } from '../../utils/Theme';
interface StyledColumnBoxProps {
    connected: boolean;
}

export const StyledAuthContainer = styled(Box)({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
});
export const StyledColumnBox = styled(Box)({
    // width: '85%',
    maxWidth: '32.8125rem',
    // maxHeight: '7.3125rem',
    height: 'fit-content',
    flexShrink: 0,
    // marginLeft: 'auto',
    // marginRight: 'auto',
    position: 'relative',
    left: '11.25%',
    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
});
export const StyledHeadingTypography = styled(Typography)({
    fontFamily: 'Helvetica Neue',
    fontSize: Fonts.mainHeaders,
    fontWeight: 700,
    color: Colors.black,
    fontStyle: 'normal',
    lineHeight: 'normal',
    marginBottom: '1.37rem',
});
export const StyledSubHeadingTypography = styled(Typography)({
    fontFamily: 'Helvetica Neue',
    marginBottom: '-0.65rem',
    fontSize: Fonts.subHeaders,
    fontWeight: 700,
    color: Colors.lightBlack,
    fontStyle: 'normal',
    lineHeight: 'normal',
});
export const StyledContentTypography1 = styled(Typography)({
    fontSize: Fonts.copySectionHeaders,
    fontWeight: 400,
    marginTop: '1rem',
    fontFamily: 'IBM Plex Mono',
    color: Colors.lightBlack,
    fontStyle: 'normal',
    lineHeight: 'normal',
});
export const StyledContentTypography2 = styled(Typography)({
    fontSize: Fonts.copySectionHeaders,
    fontWeight: 400,
    marginTop: '1rem',
    fontFamily: 'IBM Plex Mono',
    color: Colors.courtGreen,
    fontStyle: 'normal',
    lineHeight: 'normal',
});
export const StyledContentTypographyHighlited = styled(Typography)({
    fontSize: Fonts.copySectionHeaders,
    fontWeight: 700,
    fontFamily: 'IBM Plex Mono',
    color: Colors.courtGreen,
    fontStyle: 'normal',
    lineHeight: 'normal',
    display: 'inline    ',
});
export const StyledRowBox = styled(Box)({
    // width: '85%',
    // marginLeft: 'auto',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginTop: '3.19rem',
    // marginRight: 'auto',
    marginBottom: '2.25rem',
    alignItems: 'center',
    display: 'flex',
});
export const StyledBox = styled(Box)<StyledColumnBoxProps>(({ connected }) => ({
    width: '31.24619rem',
    height: '31.24619rem',
    flexShrink: 0,
    strokeWidth: '1px',
    backgroundColor: connected ? Colors.orange : Colors.lightBlack,
    borderRadius: '31.24619rem',
}));
export const StyledButton = styled(Button)({
    // width: '19rem',
    height: '72px',
    borderRadius: '6px',
    // backgroundColor: Colors.lightGrey,
    // variant: 'text',
    color: Colors.lightBlack,
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.largeButtons,
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'underline',
    textTransform: 'none',
    '&:disabled': {
        backgroundColor: Colors.green,
        color: Colors.lightGrey,
    },
    '&:hover': {
        backgroundColor: 'transparent',
    },
    '&.Mui-disabled': {
        color: Colors.lightBlack,
        fontfamily: 'IBM Plex Mono',
        fontSize: '0.875rem',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        textDecoration: 'none',
    },
});
export const StyledTypography = styled(Typography)({
    fontFamily: 'Helvetica Neue',
    fontSize: Fonts.subHeaders,
    fontWeight: 700,
    textAlign: 'center',
    color: Colors.lightBlack,
    width: 350,
    marginLeft: 'auto',
    marginRight: 'auto',
});
export const StyledSubmitButton = styled(Button)({
    width: '19rem',
    height: '5%',
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.largeButtons,
    color: Colors.lightBlack,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '0.5%',
    marginBottom: '2.5rem',
    fontWeight: 700,
    textTransform: 'none',
    textDecoration: 'underline',
    '&:hover': {
        backgroundColor: 'transparent',
        textDecoration: 'underline',
    },
});
export const CenterContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
});
