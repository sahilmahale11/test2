import Appbar from '../../components/header/Appbar';

import Footer from '../../components/footer/Footer';

import { Box, Typography } from '@mui/material';

const DummyDashboard = () => {
    return (
        <Box sx={{ minHeight: '100vh', justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}>
            <Appbar />

            <Typography variant='h3' sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
                {' '}
                Welcome to Dashboard
            </Typography>

            <Footer />
        </Box>
    );
};

export default DummyDashboard;
