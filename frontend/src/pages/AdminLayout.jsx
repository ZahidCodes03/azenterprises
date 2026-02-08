import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { FiHome, FiCalendar, FiFileText, FiLogOut, FiSun, FiMenu, FiX, FiUsers } from 'react-icons/fi';
import { verifyToken } from '../services/api';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                await verifyToken();
                setIsLoading(false);
            } catch (error) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
        { name: 'Bookings', path: '/admin/bookings', icon: FiCalendar },
        { name: 'Customers', path: '/admin/customers', icon: FiUsers },
        { name: 'Invoices', path: '/admin/invoices', icon: FiFileText },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                    <FiSun className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                            <FiSun className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">Admin Panel</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        bg-white shadow-xl lg:shadow-lg
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                                <FiSun className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900">A Z ENTERPRISES</h1>
                                <p className="text-xs text-gray-500">Admin Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all group"
                            >
                                <item.icon className="w-5 h-5 mr-3 group-hover:text-primary-600" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Website Link */}
                    <div className="p-4 border-t border-gray-100">
                        <Link
                            to="/"
                            className="flex items-center px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
                        >
                            <FiHome className="w-5 h-5 mr-3" />
                            Back to Website
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-all mt-1"
                        >
                            <FiLogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
