import { CardContent, Typography } from '@mui/material';

import { StyledContainer, StyledCard } from './Dashboard/DashboardCardStyle';

const CardComponent = ({ data, setRepoSelected }: any) => {
    const handleClick = (repo_details: any) => {
        if (repo_details.repo_id) {
            setRepoSelected(repo_details);
        } else if (repo_details.project_id) {
            // need to swap conditions in else if and else so that it doesn't make call to branches everytime
            setRepoSelected(repo_details);
        } else {
            setRepoSelected({ branch_name: repo_details });
        }
    };

    return (
        <StyledContainer>
            {data && data.length > 0 ? (
                data.map((repo_details: any) => {
                    return (
                        <StyledCard onClick={() => handleClick(repo_details)} key={repo_details.repo_id || repo_details.project_id || repo_details}>
                            <CardContent>
                                {repo_details && (
                                    <Typography variant='h3'>{repo_details.repo_name || repo_details.project_name || repo_details}</Typography>
                                )}
                            </CardContent>
                        </StyledCard>
                    );
                })
            ) : (
                <Typography>No data found</Typography>
            )}
        </StyledContainer>
    );
};

export default CardComponent;
