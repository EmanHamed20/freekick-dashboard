// src/AppContent.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { checkAuth } from './features/auth/authSlice.js';
import router from './routes';

function AppContent() {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log('🚀 App: Checking auth on mount');
        dispatch(checkAuth());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return <RouterProvider router={router} />;
}

export default AppContent;