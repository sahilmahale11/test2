import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PrivateRoutes from './routes/PrivateRoute';
import { Box, CircularProgress } from '@mui/material';
const LazySignup = lazy(() => import('../src/screens/onboarding/SignupScreen'));
const LazyAuth = lazy(() => import('../src/screens/onboarding/AuthPlatforms'));
const LazyOauth = lazy(() => import('../src/screens/onboarding/OAuth'));
// const LazyHomeScreen = lazy(() => import('../src/screens/onboarding/HomeScreen'));
const LazyRepoHome = lazy(() => import('../src/screens/repo_onboarding/RepoHomeScreen'));
const LazyProjectHome = lazy(() => import('./screens/project_onboarding/ProjectHomeScreen'));
const LazyAccount = lazy(() => import('../src/screens/AccountsDetails/AccountInfo'));
const LazyEnviateAnalysis = lazy(() => import('./screens/EnviateAnalysis/EnviateAnalysis'));
const LazySplash = lazy(() => import('../src/screens/onboarding/SplashLoad'));
const LazyDashboard = lazy(() => import('../src/screens/Dashboard/DummyDashboard'));
const LazyDummyHomeScreen = lazy(() => import('../src/screens/onboarding/HomeScreenDummy'));
const LazyHumanValidate = lazy(() => import('../src/screens/repo_onboarding/HumanValidateScreen'));
const NewPassword = lazy(() => import('./screens/AccountsDetails/NewPassword'));
const loader = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );
};
function App() {
    return (
        <>
            <Routes>
                <Route
                    path='/'
                    element={
                        <Suspense fallback={loader()}>
                            <LazySplash />
                        </Suspense>
                    }
                />
                <Route
                    path='/signup'
                    element={
                        <Suspense fallback={loader()}>
                            <LazySignup />
                        </Suspense>
                    }
                />{' '}
                <Route
                    path='/home'
                    element={
                        <Suspense fallback={loader()}>
                            <LazyDummyHomeScreen />
                        </Suspense>
                    }
                />
                {/* <Route
                    path='/home'
                    element={
                        <Suspense fallback={loader()}>
                            <LazyHomeScreen />
                        </Suspense>
                    }
                /> */}
                <Route element={<PrivateRoutes />}>
                    <Route
                        path='/newPassword'
                        element={
                            <Suspense fallback={loader()}>
                                <NewPassword />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/accountInfo'
                        element={
                            <Suspense fallback={loader()}>
                                <LazyAccount />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/auth'
                        element={
                            <Suspense fallback={loader()}>
                                <LazyAuth />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/oauth'
                        element={
                            <Suspense fallback={loader()}>
                                <LazyOauth />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/repo'
                        element={
                            <Suspense fallback={loader()}>
                                <LazyRepoHome />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/projects'
                        element={
                            <Suspense fallback={loader()}>
                                <LazyProjectHome />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/dashboard'
                        element={
                            <Suspense fallback={loader()}>
                                <LazyDashboard />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/validate'
                        element={
                            <Suspense fallback={loader()}>
                                <LazyHumanValidate />
                            </Suspense>
                        }
                    />
                    <Route
                        path='/enviateAnalysis'
                        element={
                            <Suspense fallback={loader()}>
                                <LazyEnviateAnalysis />
                            </Suspense>
                        }
                    />
                </Route>
                <Route path='*' element={<Navigate to='/home' />} />
            </Routes>
        </>
    );
}

export default App;
