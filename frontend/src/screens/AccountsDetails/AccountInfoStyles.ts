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
    marginTop: 'auto',
    marginBottom: 'auto',
});

export const StledLinkStatus = styled(Typography)({
    color: Colors.orange,
    fontFamily: ' Helvetica Neue',
    fontSize: Fonts.standardButtons,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    marginTop: '15px',
    cursor: 'pointer',
});

export const StyledTitle = styled(Typography)(({}) => ({
    color: Colors.black,
    /* Main Headers 36 */
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    cursor: 'pointer',
}));
export const StyledHeader = styled(Typography)(({}) => ({
    color: Colors.black,
    /* Main Headers 36 */
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    fontSize: Fonts.mainHeaders,
    cursor: 'pointer',
}));
export const StyledHeader2 = styled(Typography)(({}) => ({
    color: Colors.black,
    /* Main Headers 36 */
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    marginTop: '34px',
    fontSize: Fonts.mainHeaders,
    cursor: 'pointer',
}));
export const StyledUserData = styled(Typography)(({}) => ({
    color: Colors.black,
    /* Main Headers 36 */
    fontFamily: 'Helvetica Neue',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    marginTop: '15px',
    cursor: 'pointer',
    fontSize: Fonts.standardButtons,
}));
export const StyledLink = styled(Link)({
    color: Colors.lightBlack,
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.copyButtons,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
    textDecorationLine: 'underline',
    marginTop: '16px',
    display: 'flex',
    cursor: 'pointer',
});

export const StyledTextField = styled(TextField)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginTop: 10,
    },

    [theme.breakpoints.up('sm')]: {
        width: 350,
        marginTop: 15,
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
export const StyledHeading = styled(Typography)(({}) => ({
    color: Colors.black /* Copy Headers 14 */,
    fontFamily: ' Helvetica Neue',
    fontSize: Fonts.standardButtons,
    fontStyle: 'normal',
    fontWeight: '700',
    cursor: 'pointer',
    lineHeight: 'normal',
    marginTop: '10px',
}));
export const StyledlinkMsg = styled(Typography)(({}) => ({
    color: Colors.lightBlack,
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.copyButtons,
    cursor: 'pointer',

    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
    marginTop: '13px',
}));
export const StyledButton = styled(Button)(({}) => ({
    marginTop: '5%',
    marginBottom: 2,
    width: '348px',
    height: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px',
    cursor: 'pointer',
    color: Colors.lightBlack,
    backgroundColor: '#D3D8D4',
    // '&.disabled': {
    //     backgroundColor: theme.palette.secondary.main,
    // },
}));

export const LoaderBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
