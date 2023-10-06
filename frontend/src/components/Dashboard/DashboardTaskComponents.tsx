import { CardContent, Typography } from '@mui/material';
import { StyledContainer, StyledCard, StyledRowBox } from './DashboardCardStyle';

const DashboardTaskComponent = ({ tasks }: any) => {
    return (
        <StyledContainer sx={{ width: '80%' }}>
            <StyledCard key={tasks.task_id} sx={{ width: '100%' }}>
                <CardContent>
                    <StyledRowBox sx={{ justifyContent: 'space-between' }}>
                        <Typography variant='h4'>{tasks.task_name}</Typography>
                        <Typography variant='h4'>{tasks.completion_score}</Typography>
                    </StyledRowBox>
                </CardContent>
            </StyledCard>
        </StyledContainer>
    );
};
export default DashboardTaskComponent;
