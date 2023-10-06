import { Box, Card, styled } from '@mui/material';
export const StyledContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
});
export const StyledCard = styled(Card)({
    minWidth: 275,
    marginTop: 3,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    cursor: 'auto',
    backgroundColor: 'powderblue',
});
export const StyledRowBox = styled(Box)({
    display: 'flex',
});
export const StyledTaskBox = styled(Box)({
    backgroundColor: '#ffca75',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});
