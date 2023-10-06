import { StyledContainer, StyledButton } from './FormStyles';
import { Typography, CssBaseline, Box, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Appbar from '../../components/header/Appbar';
import Sidebar from '../../components/repo_onboarding/Sidebar';
import { useState } from 'react';
import TaskTable from '../../components/repo_onboarding/TaskTable';
import { Enviate_API } from '../../utils/endpoints';
const HomeScreen = () => {
    const navigate = useNavigate();
    //     const authContext = useContext(DataContext);
    //     // useEffect(() => {
    //     //     if (!authContext.isAuthenticated()) {
    //     //         navigate('/login');
    //     //     }
    //     // }, [authContext, navigate]);

    const [flag, setFlag] = useState(false);
    const [sideBarBtn, setSideBarBtn] = useState<any>('');
    const sideMenu = (menu: string) => {
        if (menu === 'tasks') {
            if (flag) {
                setSideBarBtn('');
                setFlag(false);
            } else {
                setSideBarBtn(<TaskTable url={Enviate_API.TASK_TABLE} />);
                setFlag(true);
            }
        }
    };
    return (
        <Box sx={{ flexDirection: 'column', display: 'flex' }}>
            <CssBaseline />
            <Appbar />

            <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <StyledContainer sx={{ marginTop: 2 }}>
                    <Sidebar sideMenu={sideMenu} />
                    <Typography variant='h4'>Enviate HomeScreen</Typography>
                    <StyledButton
                        variant='contained'
                        onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}>
                        logout
                    </StyledButton>
                    {sideBarBtn}
                </StyledContainer>
            </Box>
        </Box>
    );
};

export default HomeScreen;
