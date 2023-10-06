import { Button, Container, Step, Typography, styled } from '@mui/material';
import { Colors, Fonts } from '../../utils/Theme';

export const StyledContainer = styled(Container)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '945px',
        height: '108px',
        backgroundColor: Colors.lightWhite,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0,
        borderRadius: '6px',
        cursor: 'pointer',
    },
    [theme.breakpoints.up('sm')]: {
        width: '945px',
        height: '108px',
        backgroundColor: Colors.lightWhite,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0,
        cursor: 'pointer',
        borderRadius: '6px',
    },
}));

export const StyledBox = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '180px',
        marginLeft: '56px',
        backgroundColor: Colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        marginRight: '75px',
        borderRadius: '6px',
        height: '60px',
        cursor: 'pointer',
    },
    [theme.breakpoints.up('sm')]: {
        width: '180px',
        height: '60px',
        marginLeft: '56px',
        backgroundColor: Colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        marginRight: '75px',
        cursor: 'pointer',
        borderRadius: '6px',
    },
}));

export const StyledText = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontFamily: 'IBM Plex Mono',
        fontWeight: 700,
        color: Colors.lightBlack,
        lineHeight: 'normal',
        fontStyle: 'normal',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '13px',
        borderRadius: '6px',
        fontSize: Fonts.standardButtons,
    },
    [theme.breakpoints.up('sm')]: {
        fontFamily: 'IBM Plex Mono',
        fontWeight: 700,
        color: Colors.lightBlack,
        lineHeight: 'normal',
        fontStyle: 'normal',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '13px',
        borderRadius: '6px',
        fontSize: Fonts.standardButtons,
    },
}));

export const StyledStep = styled(Step)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiStepConnector-root': {
            color: Colors.red,
            top: '15px',
            left: 'calc(-125% + 20px)',
            right: 'calc(42% + 20px)',
            '& .MuiStepConnector-line': {
                borderColor: Colors.lightGrey,
                width: '48px',
                borderTopWidth: '2px',
            },
        },
        flexDirection: 'column',
    },
    [theme.breakpoints.up('sm')]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiStepConnector-root': {
            color: Colors.red,
            top: '15px',
            left: 'calc(-125% + 20px)',
            right: 'calc(42% + 20px)',
            '& .MuiStepConnector-line': {
                borderColor: Colors.lightGrey,
                width: '48px',
                borderTopWidth: '2px',
            },
        },
    },
}));

export const StyledStepLabel = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        color: Colors.black,
        fontFamily: 'IBM Plex mono',
        fontSize: Fonts.copySectionHeaders,
        textAlign: 'center',
        width: '18px',
        height: '15px',
    },
    [theme.breakpoints.up('sm')]: {
        color: Colors.black,
        fontFamily: 'IBM Plex mono',
        fontSize: Fonts.copySectionHeaders,
        textAlign: 'center',
        width: '18px',
        height: '15px',
    },
}));
