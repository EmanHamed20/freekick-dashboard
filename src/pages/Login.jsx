// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Eye, EyeOff, Smartphone, Lock } from 'lucide-react';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, isAuthenticated, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    console.log('🔐 Login Component - Auth State:', {
        isAuthenticated,
        isLoading,
        error
    });

    // Get the intended destination or default to dashboard
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (isAuthenticated) {
            console.log('🎯 Login successful, redirecting to:', from);
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('🔄 Login form submitted');
        login(phone, password);
    };

    const formatPhoneNumber = (value) => {
        // Remove all non-digit and non-plus characters
        const cleaned = value.replace(/[^\d+]/g, '');

        // If it starts with +, preserve it
        const hasPlus = cleaned.startsWith('+');
        const digits = hasPlus ? cleaned.slice(1) : cleaned;

        // Format based on length
        if (digits.length <= 3) {
            return hasPlus ? `+${digits}` : digits;
        } else if (digits.length <= 5) {
            return hasPlus ? `+${digits.slice(0, 3)} ${digits.slice(3)}` : digits;
        } else if (digits.length <= 8) {
            return hasPlus ? `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}` : digits;
        } else {
            return hasPlus ? `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 12)}` : digits;
        }
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-blue-600 text-white rounded-xl p-3 mr-3">
                            <span className="text-xl font-bold">FREE KCK</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Panel</h1>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Phone Number Field */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Your phone number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Smartphone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    required
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="+971 5X XXX XXXX"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Your password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error.message || 'Login failed. Please check your credentials.'}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Footer Note */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600 mb-4">
                            Don't have an account?
                        </p>
                        <div className="text-center text-xs text-gray-500 space-y-1">
                            <p>This platform is for</p>
                            <p>administrators only. If you're</p>
                            <p>not an administrator, please contact support.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;