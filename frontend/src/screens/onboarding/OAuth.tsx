import { CircularProgress } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import authAxios from '../../service/http-service';
import { Enviate_API } from '../../utils/endpoints';
import { LoaderBox } from './SignupScreenCss';

const OAuth = () => {
    const [githubCode, setGithubCode] = useState('');
    const authContext = useContext(DataContext);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        if (urlParams.has('code')) {
            const extractedCode = urlParams.get('code');
            if (authContext.userDetails.linkage_status === 'NOT_STARTED') {
                navigate(`/auth?code=${extractedCode}`);
            } else {
                if (extractedCode) {
                    setGithubCode(extractedCode);
                }
            }
        }
    }, [location.search]);

    const { refetch, status: statusGithub } = useQuery({
        enabled: githubCode != '',
        queryKey: ['github_integrate'],

        queryFn: async () => {
            try {
                const data = await authAxios.get(Enviate_API.GITHUB_URL, {
                    params: { access_code: githubCode },
                });
                return data.data;
            } catch (err: any) {
                // eslint-disable-next-line no-console
                console.log('err from ouath', err);
                localStorage.clear();
                navigate('/home');
            }
        },

        retry: false,
        retryOnMount: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (githubCode !== '' && statusGithub === 'loading') {
            refetch();
        }

        if (statusGithub === 'success') {
            if (authContext.userDetails.linkage_status === 'INITIATED' || authContext.userDetails.linkage_status === 'AWAITING_VALIDATION') {
                navigate('/enviateAnalysis');
            } else if (authContext.userDetails.linkage_status === 'UNSUPPORTED' || authContext.userDetails.linkage_status === 'SUPPORTED') {
                navigate('/validate');
            } else if (authContext.userDetails.linkage_status === 'FAILED') {
                navigate('/enviateAnalysis');
            } else {
                navigate('/dashboard');
            }
        }
    }, [githubCode, refetch, statusGithub]);

    return (
        <LoaderBox>
            <CircularProgress />
        </LoaderBox>
    );
};

export default OAuth;
