import Enviate_Footer_Logo from '../../assets/Enviate_Footer_Logo.png';
import EnviateCopyRight from '../../assets/EnviateCopyRight';
import { headerValues, footerValues } from '../../utils/constants';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
    StyledFooterContainer,
    StyledFooterColumnBox,
    StyledRowBox,
    StyledTypography,
    StyledTextField,
    StyledButton,
    StyledProductUpdateTypography,
} from './FooterStyles';
const Footer = () => {
    return (
        <StyledFooterContainer>
            <StyledRowBox>
                <StyledFooterColumnBox sx={{ marginTop: '30px', marginBottom: '13px', alignItems: 'center' }}>
                    <img src={Enviate_Footer_Logo} alt='Enviate Logo' style={{ width: '75px', height: '52px', marginBottom: '1rem' }} />
                    <EnviateCopyRight />
                </StyledFooterColumnBox>
                <StyledFooterColumnBox sx={{ marginTop: '36px', marginBottom: '30px' }}>
                    <StyledTypography sx={{ marginBottom: '12px', cursor: 'pointer' }}>{headerValues.about}</StyledTypography>
                    <StyledTypography sx={{ cursor: 'pointer' }}>{headerValues.support}</StyledTypography>
                </StyledFooterColumnBox>
            </StyledRowBox>
            <StyledRowBox sx={{ marginRight: '1.5rem' }}>
                <StyledFooterColumnBox sx={{ marginTop: '21px', marginBottom: '12px' }}>
                    <StyledTypography sx={{ fontSize: '14px' }}>{footerValues.subscribe}</StyledTypography>
                    <StyledRowBox sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        <StyledTextField fullWidth={true} />
                        <StyledButton variant='outlined'>
                            <KeyboardArrowRightIcon fontSize='large' sx={{ color: 'black' }} />
                        </StyledButton>
                    </StyledRowBox>
                    <StyledProductUpdateTypography>{footerValues.productUpdates}</StyledProductUpdateTypography>
                </StyledFooterColumnBox>
            </StyledRowBox>
        </StyledFooterContainer>
    );
};
export default Footer;
