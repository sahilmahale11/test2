import { useQuery } from '@tanstack/react-query';
import { List, Divider, Box, CircularProgress, Typography } from '@mui/material';
import authAxios from '../../service/http-service';
import { LoaderBox } from '../../screens/onboarding/FormStyles';
import { propType } from '../../interfaces/types';
const TaskTable = (props: propType) => {
    const { isLoading, isError, data } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await authAxios.get(props.url);
            const data = await res.data;
            return data;
        },
        retry: false,
        retryOnMount: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return (
            <LoaderBox>
                <CircularProgress />
            </LoaderBox>
        );
    }
    if (isError) {
        return <Typography>Error occured</Typography>;
    }

    return (
        <Box>
            {data.length !== 0 ? (
                data.map((task: any) => (
                    <List key={task.task_id}>
                        <Typography>Task ID: {task.task_id}</Typography>
                        <Typography>Task Name: {task.task_name}</Typography>
                        <Typography>Task Status: {task.task_status}</Typography>
                        <Divider />
                    </List>
                ))
            ) : (
                <Typography>No Tasks</Typography>
            )}
        </Box>
    );
};

export default TaskTable;
