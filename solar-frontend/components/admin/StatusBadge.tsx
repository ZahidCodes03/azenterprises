export interface AdminStatusBadgeProps {
    status: 'PENDING' | 'APPROVED' | 'INSTALLATION_SCHEDULED' | 'INSTALLED' | 'CANCELLED';
}

export default function StatusBadge({ status }: AdminStatusBadgeProps) {
    const statusConfig = {
        PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
        APPROVED: { color: 'bg-blue-100 text-blue-800', label: 'Approved' },
        INSTALLATION_SCHEDULED: { color: 'bg-purple-100 text-purple-800', label: 'Scheduled' },
        INSTALLED: { color: 'bg-green-100 text-green-800', label: 'Installed' },
        CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };

    const config = statusConfig[status];

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
            {config.label}
        </span>
    );
}
