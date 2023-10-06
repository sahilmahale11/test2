import React from 'react';
import { Box, Typography } from '@mui/material';

// Define the props interface
interface TaskCardProps {
    description: string | '';
}

const TaskCard: React.FC<TaskCardProps> = ({ description }) => {
    return (
        <Box sx={{ height: '350px', margin: '10px', overflowX: 'auto' }}>
            <Typography>{description}</Typography>
        </Box>
    );
};

export default TaskCard;
