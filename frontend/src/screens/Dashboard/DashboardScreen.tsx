import { Box } from '@mui/material';
// import DashboardCardComponent from '../../components/dashboard/DashboardCardComponent';
import DashboardCardComponent from '../../components/Dashboard/DashboardCardComponent';

const DashboardScreen = () => {
    const data = [
        {
            project_id: 0,
            project_name: 'onboarding',
            completion_score: '90',
            tasks: [
                {
                    task_id: 1,
                    task_name: 'signup',
                    completion_score: '100',
                },
                {
                    task_id: 2,
                    task_name: 'login',
                    completion_score: '100',
                },
                {
                    task_id: 3,
                    task_name: 'Auth Integrations',
                    completion_score: '90',
                },
            ],
        },
        {
            project_id: 1,
            project_name: 'feature development',
            completion_score: '75',
            tasks: [
                {
                    task_id: 4,
                    task_name: 'API endpoints',
                    completion_score: '80',
                },
                {
                    task_id: 5,
                    task_name: 'UI components',
                    completion_score: '70',
                },
            ],
        },
        {
            project_id: 2,
            project_name: 'bug fixing',
            completion_score: '85',
            tasks: [
                {
                    task_id: 6,
                    task_name: 'Critical issues',
                    completion_score: '90',
                },
                {
                    task_id: 7,
                    task_name: 'Minor bugs',
                    completion_score: '80',
                },
            ],
        },
        {
            project_id: 3,
            project_name: 'documentation',
            completion_score: '95',
            tasks: [
                {
                    task_id: 8,
                    task_name: 'User guides',
                    completion_score: '100',
                },
            ],
        },
        {
            project_id: 4,
            project_name: 'testing',
            completion_score: '70',
            tasks: [
                {
                    task_id: 9,
                    task_name: 'Unit testing',
                    completion_score: '75',
                },
                {
                    task_id: 10,
                    task_name: 'Integration testing',
                    completion_score: '65',
                },
            ],
        },
        {
            project_id: 5,
            project_name: 'performance optimization',
            completion_score: '80',
            tasks: [
                {
                    task_id: 11,
                    task_name: 'Code profiling',
                    completion_score: '85',
                },
            ],
        },
        {
            project_id: 6,
            project_name: 'security enhancements',
            completion_score: '88',
            tasks: [
                {
                    task_id: 12,
                    task_name: 'Vulnerability scanning',
                    completion_score: '90',
                },
                {
                    task_id: 13,
                    task_name: 'Security patches',
                    completion_score: '85',
                },
            ],
        },
        {
            project_id: 7,
            project_name: 'UI/UX redesign',
            completion_score: '60',
            tasks: [
                {
                    task_id: 14,
                    task_name: 'Wireframing',
                    completion_score: '70',
                },
                {
                    task_id: 15,
                    task_name: 'Visual mockups',
                    completion_score: '50',
                },
            ],
        },
        {
            project_id: 8,
            project_name: 'data analytics',
            completion_score: '92',
            tasks: [
                {
                    task_id: 16,
                    task_name: 'Data collection',
                    completion_score: '95',
                },
                {
                    task_id: 17,
                    task_name: 'Analysis reports',
                    completion_score: '90',
                },
            ],
        },
        {
            project_id: 9,
            project_name: 'user feedback',
            completion_score: '78',
            tasks: [
                {
                    task_id: 18,
                    task_name: 'Feedback collection',
                    completion_score: '80',
                },
            ],
        },
    ];
    return (
        <Box>
            {data.map((val) => {
                return <DashboardCardComponent data={val} />;
            })}
        </Box>
    );
};
export default DashboardScreen;
