import { TextField, DialogContent, Box, Typography, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authAxios from '../../service/http-service';
import { Enviate_API } from '../../utils/endpoints';
import { repoSelectedType, branchSelectedType, addRepoType } from '../../interfaces/types';
import CrossIcon from '../../assets/CrossIcon';
import GithubLogo from '../../assets/GithubLogo.png';
import {
    StyledDialog,
    StyledButton,
    StyledDialogTitle,
    StyledDialogContent,
    StyledDialogTitleHeading,
    StyledAutoComplete,
    StyledTooltipText,
} from './RepoStyles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
const RepoComponent = ({ open, handleClose }: any) => {
    const navigate = useNavigate();

    const [repoError, setRepoError] = useState('');
    const [repoSelected, setRepoSelected] = useState<repoSelectedType>({
        repo_id: '',
        repo_name: '',
        owner_name: '',
    });
    const [repositoryError, setRepositoryError] = useState('');
    const [branchError, setBranchError] = useState('');
    const [branchSelected, setBranchSelected] = useState<branchSelectedType>({
        branch_name: '',
    });

    const { data: repo_data, isError } = useQuery({
        queryKey: ['repositories'],
        queryFn: async () => {
            try {
                const res = await authAxios.get(Enviate_API.GET_REPO);
                const data = await res.data;
                return data;
            } catch (err: any) {
                setRepositoryError(err.response.data.detail);
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
        refetch: refetch_branch,
        status: status_branch,
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
                setBranchError(err.response.data.detail);
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

    useEffect(() => {
        if (repoSelected.repo_id && status_branch === 'success') {
            refetch_branch();
        }
    }, [repoSelected]);

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
            handleClose();
            navigate('/auth');
        },
        onError(error: any) {
            setRepoError(error.response.data.detail);
        },
    });

    const handleSubmit = () => {
        const repoObj: addRepoType = {
            repo_id: repoSelected.repo_id,
            owner_name: repoSelected.owner_name,
            repo_name: repoSelected.repo_name,
            branch_name: branchSelected.branch_name,
        };
        if (repoSelected.repo_id != '' && branchSelected.branch_name != '') {
            repoMutation.mutate(repoObj);
        }
    };
    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 400,
            marginRight: '19.5em',
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));
    return (
        <Box>
            <StyledDialog open={open} onClose={() => handleClose()}>
                <StyledDialogTitle>
                    <CrossIcon onClick={() => handleClose()} />
                    <img width={200} height={115.48} src={GithubLogo} alt={'Github logo'} />
                    <StyledDialogTitleHeading>
                        Select Repo &amp; Branch
                        <HtmlTooltip
                            title={
                                <Box>
                                    <StyledTooltipText
                                        sx={{
                                            fontWeight: 700,
                                        }}>
                                        Why do I need to select a repo and branch?
                                    </StyledTooltipText>
                                    <StyledTooltipText>
                                        When you connect your GitHub account, you’ll be prompted to select a repository and a branch. The repository
                                        you select will be the codebase we use to evaluate against the Jira project you select. The branch you choose
                                        will be your “protected” branch. This will be the branch we will be monitoring for any new or updated pull
                                        requests. Only pull requests against this protected branch will show up in your PR dashboard. We recommend
                                        choosing whichever branch you use for production code - that may be your main or master branch.
                                    </StyledTooltipText>
                                </Box>
                            }>
                            <HelpOutlineOutlinedIcon sx={{ color: '#0E2A31', marginLeft: '10px', fontWeight: 100, cursor: 'pointer' }} />
                        </HtmlTooltip>
                    </StyledDialogTitleHeading>
                </StyledDialogTitle>
                <DialogContent>
                    <StyledDialogContent>
                        <StyledAutoComplete
                            disablePortal
                            disabled={!repo_data}
                            id='combo-box-demo'
                            options={repo_data ? repo_data : []}
                            value={repoSelected || { repo_id: '', repo_name: '', owner_name: '' }} // Provide an empty object as default value
                            getOptionLabel={(option: any) => option.repo_name}
                            onChange={(event: any, newValue: any) => {
                                // eslint-disable-next-line no-console
                                console.log('event', event, newValue);
                                setRepoSelected(newValue || { repo_id: '', repo_name: '', owner_name: '' }); // Provide an empty object as default value
                                setBranchSelected({ branch_name: '' });
                            }}
                            renderInput={(params: any) => <TextField {...params} label='Select Repository' />}
                        />

                        <StyledAutoComplete
                            id='combo-box-demo'
                            disablePortal
                            options={branches_data ? branches_data.branches : []}
                            value={branchSelected.branch_name || ''} // Provide an empty string as default value
                            disabled={!branches_data}
                            getOptionLabel={(option: any) => option}
                            onChange={(event: any, newValue: any) => {
                                // eslint-disable-next-line no-console
                                console.log('event', event, newValue);
                                setBranchSelected({ branch_name: newValue || '' }); // Provide an empty string as default value
                            }}
                            renderInput={(params) => <TextField {...params} label='Select Branch' />}
                        />

                        <StyledButton onClick={handleSubmit}>Submit</StyledButton>
                        {repoMutation.isError && (
                            <Typography color='red' marginTop={'10px'}>
                                {repoError || ''}
                            </Typography>
                        )}
                        {isError && (
                            <Typography color='red' marginTop={'10px'}>
                                {repositoryError || ''}
                            </Typography>
                        )}
                        {branchError && (
                            <Typography color='red' marginTop={'10px'}>
                                {branchError || ''}
                            </Typography>
                        )}
                    </StyledDialogContent>
                </DialogContent>
            </StyledDialog>
        </Box>
    );
};
export default RepoComponent;
