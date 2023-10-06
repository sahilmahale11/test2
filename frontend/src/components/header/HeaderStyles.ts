import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Colors, Fonts } from '../../utils/Theme';
export const StyledBox = styled(Box)({
    display: 'flex',
    marginTop: '15px',
    marginBottom: '15px',
    alignItems: 'center',
});
export const StyledHeaderText = styled(Typography)({
    color: '#D9D9D9',
    fontFamily: 'Heebo',
    fontSize: Fonts.subHeaders,
    fontWeight: '700px',
});
export const StyledHeaderContainer = styled(Box)({
    display: 'flex',
    marginLeft: '30px',
    marginRight: '20px',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
});
export const StyledLink = styled(Link)({
    color: Colors.lightWhite,
    fontFamily: 'Helvetica Neue',
    fontSize: Fonts.copySectionHeaders,
    fontWeight: 700,
    fontStyle: 'normal',
    lineHeight: 'normal',
});
export const StyledText = styled(Typography)({
    fontFamily: 'Helvetica Neue',
    fontSize: '14px',
    fontWeight: Fonts.copySectionHeaders,
    fontStyle: 'normal',
    lineHeight: 'normal',
});
export const StyledColumnBox = styled(Box)({
    marginLeft: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
});
