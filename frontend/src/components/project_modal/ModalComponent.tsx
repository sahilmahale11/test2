import { Typography, TextField, DialogContent, Box, CircularProgress, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import authAxios from '../../service/http-service';
import { Enviate_API } from '../../utils/endpoints';
import { useState } from 'react';
import AtlassianLogo from '../../assets/AtlassianLogo.png';
import { useNavigate } from 'react-router-dom';
import { projectSelectedType } from '../../interfaces/types';
import {
    StyledButton,
    StyledAutoComplete,
    StyledDialogContent,
    StyledDialogTitle,
    StyledDialogTitleHeading,
    StyledDialog,
    CenterContainer,
    StyledTooltipText,
} from './ModalStyle';

import CrossIcon from '../../assets/CrossIcon';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const ModalComponent = ({ open, handleClose }: any) => {
    const navigate = useNavigate();
    const [projectError, setProjectError] = useState('');
    const [repoError, setRepoError] = useState('');
    const [projectSelected, setProjectSelected] = useState<projectSelectedType>({
        project_id: '',
        project_name: '',
        project_key: '',
    });

    const {
        data: jira_projects,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['jira_projects'],

        queryFn: async () => {
            try {
                const res = await authAxios.get(Enviate_API.GET_JIRA_PROJECTS);
                const data = await res.data;
                return data;
            } catch (err: any) {
                setProjectError(err.response.data.detail);
                // eslint-disable-next-line no-console
                console.log('err', err.response.data.detail, projectError);
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
            handleClose();
            navigate('/auth');
        },
        onError(error: any) {
            setRepoError(error.response.data.detail);
        },
    });
    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            marginRight: '12em',
            justifyContent: 'center',
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));
    const handleSubmit = () => {
        const projObj = {
            project_id: projectSelected.project_id,
            project_name: projectSelected.project_name,
            project_key: projectSelected.project_key,
        };
        if (projectSelected.project_id != '') {
            projectMutation.mutate(projObj);
        }
    };

    return (
        <Box>
            <StyledDialog open={open} onClose={() => handleClose()}>
                <StyledDialogTitle>
                    <CrossIcon onClick={() => handleClose()} />

                    <img width={188} height={112} src={AtlassianLogo} alt={'Github logo'} />

                    <StyledDialogTitleHeading>
                        Select Project
                        <HtmlTooltip
                            title={
                                <Box>
                                    <StyledTooltipText
                                        sx={{
                                            fontWeight: 700,
                                        }}>
                                        Which Jira Project should I select?
                                    </StyledTooltipText>
                                    <StyledTooltipText>
                                        Select Project below to connect to Enviate. This project should contain the requirements you want to be
                                        evaluating your code against. We will be pulling your Epics, Stories, Tasks, and Issues.
                                    </StyledTooltipText>
                                </Box>
                            }>
                            <HelpOutlineOutlinedIcon sx={{ color: '#0E2A31', marginLeft: '10px', fontWeight: 100, cursor: 'pointer' }} />
                        </HtmlTooltip>
                    </StyledDialogTitleHeading>
                </StyledDialogTitle>

                <DialogContent>
                    {isLoading ? (
                        <CenterContainer>
                            <CircularProgress />
                        </CenterContainer>
                    ) : (
                        <StyledDialogContent>
                            <StyledAutoComplete
                                disablePortal
                                id='combo-box-demo'
                                options={jira_projects ? jira_projects : []}
                                value={projectSelected}
                                getOptionLabel={(option: any) => option.project_name}
                                onChange={(event: any, newValue: any) => {
                                    // eslint-disable-next-line no-console
                                    console.log('event', event, newValue);
                                    setProjectSelected(newValue!);
                                }}
                                renderInput={(params: any) => <TextField {...params} label='Select Project' />}
                            />

                            <StyledButton onClick={handleSubmit}>Submit</StyledButton>
                            {projectMutation.isError && (
                                <Typography color='red' marginTop={'10px'}>
                                    {projectMutation.isError ? repoError : ''}
                                </Typography>
                            )}
                            {isError && (
                                <Typography color='red' marginTop={'10px'}>
                                    {isError ? projectError : ''}
                                </Typography>
                            )}
                        </StyledDialogContent>
                    )}
                </DialogContent>
            </StyledDialog>
        </Box>
    );
};

export default ModalComponent;
