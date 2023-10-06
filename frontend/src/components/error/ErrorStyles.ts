import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { Colors, Fonts } from '../../utils/Theme';

export const Errorheader = styled(Box)({
    width: '100%',
    height: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.orange,
});
export const ErrorTypography = styled(Typography)({
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Helvetica Neue',
    fontSize: Fonts.copySectionHeaders,
    fontWeight: 700,
    marginLeft: 'auto',
});
