import { styled } from '@mui/material/styles';
import { Box, TextField, Button, Link } from '@mui/material';
export const StyledContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
}));

export const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: 15,
    marginBottom: 10,
    width: 100,
    backgroundColor: theme.palette.primary.main,
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
