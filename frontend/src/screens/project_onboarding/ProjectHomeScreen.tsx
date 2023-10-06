import { Typography, Box, CircularProgress } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import authAxios from '../../service/http-service';
import { Enviate_API } from '../../utils/endpoints';
import { CenterContainer } from '../repo_onboarding/RepoStyle';
import React, { useState, useCallback, useEffect } from 'react';
import CardComponent from '../../components/CardComponent';
import { useNavigate } from 'react-router-dom';
import { projectSelectedType } from '../../interfaces/types';

const MemoizedCardComponent = React.memo(CardComponent);

function ProjectHomeScreen() {
    const navigate = useNavigate();

    const [repoError, setRepoError] = useState('');
    const [projectSelected, setProjectSelected] = useState<projectSelectedType>({
        project_id: '',
        project_name: '',
        project_key: '',
    });

    const handleRepoSelected = useCallback((selectedProject: projectSelectedType) => {
        setProjectSelected(selectedProject);
    }, []);

    const {
        data: jira_projects,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['jira_projects'],
        queryFn: async () => {
            try {
                const res = await authAxios.get(Enviate_API.GET_JIRA_PROJECTS);
                const data = await res.data;
                return data;
            } catch (err: any) {
                throw new Error(err.response.data.detail);
            }
        },
        retry: false,
        retryOnMount: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    const projectMutation = useMutation({
        mutationKey: ['project_selection'],
        mutationFn: (addProject: projectSelectedType) => {
            try {
                return authAxios.post(Enviate_API.POST_JIRA_PROJECT, addProject);
            } catch (error: any) {
                throw new Error(error.response.data.detail);
            }
        },
        onSuccess() {
            localStorage.setItem('jira', 'jira');
            navigate('/home');
        },
        onError(error: any) {
            setRepoError(error.response.data.detail);
        },
    });

    useEffect(() => {
        const projObj = {
            project_id: projectSelected.project_id,
            project_name: projectSelected.project_name,
            project_key: projectSelected.project_key,
        };

        if (projectSelected.project_id != '') {
            projectMutation.mutate(projObj);
        }
    }, [projectSelected.project_id]);

    if (isLoading) {
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
    if (projectMutation.isError) {
        return (
            <CenterContainer>
                <Typography>{repoError}</Typography>
            </CenterContainer>
        );
    }

    return <Box>{jira_projects && <MemoizedCardComponent data={jira_projects} setRepoSelected={handleRepoSelected} />}</Box>;
}

export default ProjectHomeScreen;
