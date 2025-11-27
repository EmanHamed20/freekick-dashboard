// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

    console.log('🛡️ ProtectedRoute - Full State:', {
        isAuthenticated,
        isLoading,
        error,
        hasToken: !!localStorage.getItem('authToken'),
        token: localStorage.getItem('authToken')?.substring(0, 20) + '...'
    });

    // Show loading spinner while checking authentication
    if (isLoading) {
        console.log('⏳ ProtectedRoute: Still loading, showing spinner...');
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                    <p className="text-sm text-gray-500 mt-2">isAuthenticated: {isAuthenticated ? 'true' : 'false'}</p>
                    <p className="text-sm text-gray-500">isLoading: {isLoading ? 'true' : 'false'}</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        console.log('🚫 ProtectedRoute: Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // User is authenticated, render the protected content
    console.log('✅ ProtectedRoute: User authenticated, rendering children');
    return children;
};

export default ProtectedRoute;