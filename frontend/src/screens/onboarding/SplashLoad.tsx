import { LoaderBox } from './SignupScreenCss';
import { DataContext } from '../../context/DataContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const SplashLoad = () => {
    const authContext = useContext(DataContext);
    const navigate = useNavigate();

    useEffect(() => {
        const linkageStatus = authContext.userDetails.linkage_status;

        if (linkageStatus === 'INITIATED ' || linkageStatus === 'AWAITING_VALIDATION' || linkageStatus === 'FAILED') {
            navigate('/enviateAnalysis');
        } else if (linkageStatus === 'SUPPORTED' || linkageStatus === 'UNSUPPORTED') {
            navigate('/validate');
        } else if (linkageStatus === 'NOT_STARTED') {
            navigate('/auth');
        } else {
            navigate('/dashboard');
        }
    }, [authContext, navigate]);

    return (
        <LoaderBox>
            <CircularProgress />
        </LoaderBox>
    );
};

export default SplashLoad;
