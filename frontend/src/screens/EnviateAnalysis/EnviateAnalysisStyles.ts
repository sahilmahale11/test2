import { Box, Button, Typography, styled } from '@mui/material';
import { Colors, Fonts } from '../../utils/Theme';

export const StyledContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
});

export const StyledHeading = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: Fonts.mainHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        marginBottom: '1.61%',
        alignSelf: 'flex-start',
        marginTop: '7vh',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: Fonts.mainHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        marginBottom: '1.61%',
        marginTop: '7vh',
        alignSelf: 'flex-start',
    },
}));

export const StyledSubheading = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: Fonts.subHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: Fonts.subHeaders,
        fontFamily: 'Helvetica Neue',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        color: Colors.courtGreen,
    },
}));

export const StyledContentBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid black',
    height: '337px',
    width: '665px',
    marginTop: '7.23%',
    marginBottom: '2.20%',
});

export const StyledButton = styled(Button)({
    // marginTop: '2.20%',
    width: '232.558px',
    height: '38px',
    flexShrink: 0,
    backgroundColor: Colors.orange,
    color: Colors.white,
    fontFamily: 'IBM Plex Mono',
    fontSize: Fonts.standardButtons,
    fontWeight: 700,
    lineHeight: 'normal',
    fontStyle: 'normal',
    textTransform: 'none',
    borderRadius: '6px',
    '&:hover': {
        backgroundColor: Colors.orange,
        color: Colors.white,
    },
});
export const StyledContentTypography = styled(Typography)({
    fontSize: Fonts.subHeaders,
    fontWeight: 700,
    marginTop: '1rem',
    fontFamily: 'Helvetica Neue',
    color: Colors.courtGreen,
});
