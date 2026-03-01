import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiSun, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminLogin } from '../services/api';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await adminLogin(email, password);
            localStorage.setItem('adminToken', response.data.token);
            toast.success('Login successful!');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                        <FiSun className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">A Z ENTERPRISES</h1>
                    <p className="text-white/70 text-sm">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                            <FiShield className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Admin Login</h2>
                        <p className="text-gray-500 text-sm mt-1">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="input-label">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-field pl-12"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-field pl-12"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary disabled:opacity-70"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Login
                                    <FiArrowRight className="w-5 h-5 ml-2" />
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
