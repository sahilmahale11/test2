import { Typography, Box } from '@mui/material';
import CardComponent from './CardComponent';
const BranchSelect = ({ data, setRepoSelected }: any) => {
    return (
        <Box>
            <Typography variant='h3'>{data.repo_name}</Typography>
            <CardComponent data={data.branches} setRepoSelected={setRepoSelected} />
        </Box>
    );
};
export default BranchSelect;
