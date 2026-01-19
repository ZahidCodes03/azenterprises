'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, LogOut } from 'lucide-react';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface AdminSidebarProps {
    onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
        { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
        { icon: Users, label: 'Users', href: '/admin/users' },
    ];

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            toast.success('Logged out successfully');
            router.push('/admin/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen shadow-xl flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">A Z Enterprises</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
            </div>

            <nav className="px-4 flex-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isActive
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-300 hover:bg-gray-800 transition-colors w-full mt-8"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </nav>
        </aside>
    );
}
