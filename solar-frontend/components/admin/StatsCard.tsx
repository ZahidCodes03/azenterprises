import { LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
    trend?: string;
}

export default function StatsCard({ title, value, icon: Icon, color = 'primary', trend }: StatsCardProps) {
    const colorClasses = {
        primary: 'bg-primary-600',
        secondary: 'bg-primary-500',
        green: 'bg-green-600',
        orange: 'bg-orange-600',
        purple: 'bg-purple-600',
    };

    return (
        <Card hover>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
                </div>
                <div className={`w-16 h-16 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
            </div>
        </Card>
    );
}
