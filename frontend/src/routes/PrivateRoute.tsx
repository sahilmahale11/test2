import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const PrivateRoutes = () => {
    const routeContext = useContext(DataContext);

    return (
        // If user not authenticated and try to visit auth route redirect to login page
        routeContext.isAuthenticated() ? (
            <Outlet />
        ) : (
            <Navigate
                to='/home'
                state={{
                    message: 'Your session has expired. Please login again.',
                }}
            />
        )
    );
};

export default PrivateRoutes;
