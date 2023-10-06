import { Box, Typography, CircularProgress } from '@mui/material';
import CardComponent from '../../components/CardComponent';
import BranchSelect from '../../components/BranchSelectComponent';
import { useQuery, useMutation } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authAxios from '../../service/http-service';
import { Enviate_API } from '../../utils/endpoints';
import { CenterContainer } from './RepoStyle.ts';
import { repoSelectedType, branchSelectedType, addRepoType } from '../../interfaces/types';
const MemoizedCardComponent = React.memo(CardComponent);
const MemoizedBranchSelect = React.memo(BranchSelect);

const RepoHomeScreen = () => {
    const navigate = useNavigate();

    const [repoError, setRepoError] = useState('');
    const [repoSelected, setRepoSelected] = useState<repoSelectedType>({
        repo_id: '',
        repo_name: '',
        owner_name: '',
    });
    const [branchSelected, setBranchSelected] = useState<branchSelectedType>({
        branch_name: '',
    });

    const handleRepoSelected = useCallback((selectedRepo: repoSelectedType) => {
        setRepoSelected(selectedRepo);
    }, []);

    const handleBranchSelected = useCallback((selectedBranch: branchSelectedType) => {
        setBranchSelected(selectedBranch);
    }, []);

    const {
        data: repo_data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['repositories'],
        queryFn: async () => {
            try {
                const res = await authAxios.get(Enviate_API.GET_REPO);
                const data = await res.data;
                return data;
            } catch (err: any) {
                throw new Error(err.response.data.detail);
            }
        },
        retry: false,
        staleTime: Infinity,
        retryOnMount: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    const {
        data: branches_data,
        isError: branches_error,
        error: branch_error,
        isInitialLoading: branch_loading,
    } = useQuery({
        queryKey: ['branches'],
        enabled: !!repoSelected.repo_id,
        queryFn: async () => {
            if (!repoSelected.owner_name || !repoSelected.repo_name) {
                return []; // Return an empty array or suitable default value
            }
            try {
                const res = await authAxios.get(`api/v1/onboardingservice/github/${repoSelected.owner_name}/${repoSelected.repo_name}/branches`);
                const data = await res.data;
                return data;
            } catch (err: any) {
                throw new Error(err.response.data.detail);
            }
        },
        retry: false,
        staleTime: Infinity,
        retryOnMount: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });
    const repoMutation = useMutation({
        mutationKey: ['repo_selection'],
        mutationFn: (addRepo: addRepoType) => {
            try {
                return authAxios.post(Enviate_API.GITHUB_REPO, addRepo);
            } catch (error: any) {
                throw new Error(error.response.data.detail);
            }
        },
        onSuccess() {
            localStorage.setItem('git', 'git');
            navigate('/home');
        },
        onError(error: any) {
            setRepoError(error.response.data.detail);
        },
    });

    /* alternative approach create functions in this file and pass those function below to components and call the function 
	to update repo and branch details and after updating details in that function only call mutate functions
	*/

    useEffect(() => {
        const repoObj: addRepoType = {
            repo_id: repoSelected.repo_id,
            owner_name: repoSelected.owner_name,
            repo_name: repoSelected.repo_name,
            branch_name: branchSelected.branch_name,
        };

        if (repoSelected.repo_id != '' && branchSelected.branch_name != '') {
            repoMutation.mutate(repoObj);
        }
    }, [repoSelected.repo_id, branchSelected.branch_name]);

    if (isLoading) {
        return (
            <CenterContainer>
                <CircularProgress />
            </CenterContainer>
        );
    }
    if (branch_loading) {
        return (
            <CenterContainer>
                <CircularProgress />
            </CenterContainer>
        );
    }

    if (isError) {
        const myError = error as any;
        return (
            <CenterContainer>
                <Typography>{myError.message}</Typography>
            </CenterContainer>
        );
    }
    if (branches_error) {
        const myError = branch_error as any;
        return (
            <CenterContainer>
                <Typography>{myError.message}</Typography>
            </CenterContainer>
        );
    }
    if (repoMutation.isError) {
        return (
            <CenterContainer>
                <Typography>{repoError}</Typography>
            </CenterContainer>
        );
    }

    return (
        <Box>
            {repo_data && !branches_data && <MemoizedCardComponent data={repo_data} setRepoSelected={handleRepoSelected} />}
            {branches_data && <MemoizedBranchSelect data={branches_data} setRepoSelected={handleBranchSelected} />}
            {/* {branchSelected.branch_name != '' && <CardComponent data={projects} setRepoSelected={setRepositoryId} />} */}
        </Box>
    );
};
export default RepoHomeScreen;
