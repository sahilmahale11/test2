import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { StyledCard, StyledContainer, StyledRowBox, StyledTaskBox } from './DashboardCardStyle';
import { CardContent, Typography, Box, Grid } from '@mui/material';
import DashboardTaskComponent from './DashboardTaskComponents';
import { useState } from 'react';
const DashboardCardComponent = ({ data }: any) => {
    const [showData, setShowData] = useState(false);
    return (
        <StyledContainer>
            <StyledCard key={data.project_id}>
                <CardContent>
                    <StyledRowBox>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Box component='span' onClick={() => setShowData(!showData)} sx={{ cursor: 'pointer' }}>
                                    {showData ? (
                                        <ArrowDropUpIcon fontSize='large' sx={{ marginTop: 2 }} />
                                    ) : (
                                        <ArrowDropDownIcon fontSize='large' sx={{ marginTop: 2 }} />
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant='h3' sx={{ marginLeft: 2 }}>
                                    {data.project_name}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant='h3'>{data.completion_score}</Typography>
                            </Grid>
                        </Grid>
                    </StyledRowBox>
                </CardContent>
            </StyledCard>
            <StyledTaskBox>
                {showData &&
                    data.tasks.map((task: any) => {
                        return <DashboardTaskComponent tasks={task} />;
                    })}
            </StyledTaskBox>
        </StyledContainer>
    );
};
export default DashboardCardComponent;
