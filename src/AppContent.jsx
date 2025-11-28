// src/AppContent.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { checkAuth } from './features/auth/authSlice.js';
import router from './routes';
import LogoLoader from "./components/common/LogoLoader.jsx";

function AppContent() {
    const dispatch = useDispatch();
    const { authCheckCompleted } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log('🚀 App: Checking auth on mount');
        dispatch(checkAuth());
    }, [dispatch]);

    // Show loader until initial auth check completes
    if (!authCheckCompleted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LogoLoader/>
            </div>
        );
    }

    return <RouterProvider router={router} />;
}

export default AppContent;