import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Flame, Briefcase, Star } from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

// ── Notification Icon based on type ──────────────────────────
const NotifIcon = ({ type }) => {
    if (type === 'CHECKIN' || type === 'STREAK_MILESTONE') {
        return (
            <div className="w-8 h-8 rounded-full bg-warning/20
                      flex items-center justify-center flex-shrink-0">
                <Flame size={14} className="text-warning" />
            </div>
        );
    }
    if (type === 'STATUS_CHANGED' || type === 'OFFER_RECEIVED') {
        return (
            <div className="w-8 h-8 rounded-full bg-success/20
                      flex items-center justify-center flex-shrink-0">
                <Briefcase size={14} className="text-success" />
            </div>
        );
    }
    if (type === 'STREAK_MILESTONE') {
        return (
            <div className="w-8 h-8 rounded-full bg-primary/20
                      flex items-center justify-center flex-shrink-0">
                <Star size={14} className="text-primary-light" />
            </div>
        );
    }
    return (
        <div className="w-8 h-8 rounded-full bg-surface-2
                    flex items-center justify-center flex-shrink-0">
            <Bell size={14} className="text-text-muted" />
        </div>
    );
};

// ── Time ago formatter ────────────────────────────────────────
const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

// ── Main Notifications Page ───────────────────────────────────
const Notifications = () => {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all' | 'unread'

    useEffect(() => {
        if (user?.email) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await notificationApi.getAll(user.email);
            setNotifications(res.data);
        } catch {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        setMarking(true);
        try {
            await notificationApi.markAllRead(user.email);
            toast.success('All notifications marked as read');
            fetchNotifications();
        } catch {
            toast.error('Failed to mark as read');
        } finally {
            setMarking(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading notifications..." />;

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const filtered = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    return (
        <div className="max-w-2xl mx-auto">

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-text-primary
                         flex items-center gap-2">
                        <Bell size={20} className="text-primary-light" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="badge badge-purple text-xs">
                {unreadCount} unread
              </span>
                        )}
                    </h1>
                    <p className="text-sm text-text-muted mt-0.5">
                        Habit check-ins, job updates and milestones
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        disabled={marking}
                        className="btn-secondary w-auto flex items-center
                       gap-2 px-4"
                    >
                        <CheckCheck size={14} />
                        {marking ? 'Marking...' : 'Mark all read'}
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-5">
                {[
                    { key: 'all',    label: `All (${notifications.length})` },
                    { key: 'unread', label: `Unread (${unreadCount})`       },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium
                        transition-colors duration-150
                        ${filter === tab.key
                            ? 'bg-primary text-white'
                            : 'bg-surface-2 text-text-muted hover:text-text-primary'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Notifications list */}
            {filtered.length === 0 ? (
                <EmptyState
                    icon="🔔"
                    title={filter === 'unread'
                        ? 'No unread notifications'
                        : 'No notifications yet'}
                    description={filter === 'unread'
                        ? "You're all caught up! Switch to All to see past notifications."
                        : 'Notifications appear here when you check in habits or update job applications.'}
                    action={filter === 'unread'
                        ? (
                            <button
                                onClick={() => setFilter('all')}
                                className="btn-secondary w-auto px-6"
                            >
                                View all notifications
                            </button>
                        )
                        : null
                    }
                />
            ) : (
                <div className="space-y-2">
                    {filtered.map(notif => (
                        <div
                            key={notif.id}
                            className={`card flex items-start gap-3
                          transition-colors duration-150
                          ${!notif.isRead
                                ? 'border-primary/30 bg-primary/5'
                                : ''
                            }`}
                        >
                            {/* Icon */}
                            <NotifIcon type={notif.type} />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm leading-relaxed
                              ${!notif.isRead
                                    ? 'text-text-primary font-medium'
                                    : 'text-text-secondary'
                                }`}>
                                    {notif.message}
                                </p>
                                <p className="text-xs text-text-muted mt-1">
                                    {notif.createdAt
                                        ? timeAgo(notif.createdAt)
                                        : 'Recently'}
                                </p>
                            </div>

                            {/* Unread indicator */}
                            {!notif.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary
                                flex-shrink-0 mt-1.5" />
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Notifications;