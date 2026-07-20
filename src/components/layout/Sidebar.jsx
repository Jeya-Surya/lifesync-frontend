import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Target, Flame,
    Briefcase, Bot, Bell, Settings, LogOut, RefreshCw
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const navItems = [
    {
        section: "Overview",
        items: [
            { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
            { label: "AI Coach", icon: Bot, path: "/coach" },
        ]
    },
    {
        section: "Modules",
        items: [
            { label: "Goals", icon: Target, path: "/goals" },
            { label: "Habits", icon: Flame, path: "/habits" },
            { label: "Job Tracker", icon: Briefcase, path: "/jobs" }
        ]
    },
    {
        section: "Account",
        items: [
            { label: "Notifications", icon: Bell, path: "/notifications" },
            { label: "Settings", icon: Settings, path: "/settings"}
        ]
    }
]

const Sidebar = () => {

    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    }

    const getInitials = () => {
        if (!name) return "U";

        return name.split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    return (
        <aside className="w-52 min-w-[208px] h-screen bg-surface
                      border-r border-border flex flex-col
                      fixed left-0 top-0 z-10">

            {/* Logo */}
            <div className="px-4 py-5 border-b border-border">
                <div className="flex items-center gap-2">
                    <RefreshCw size={18} className="text-primary-light" />
                    <span className="text-base font-semibold text-text-primary">
            LifeSync
          </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5 ml-6">
                    Personal life OS
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-3">
                {navItems.map((group) => (
                    <div key={group.section} className="mb-2">

                        {/* Section label */}
                        <p className="px-4 py-1.5 text-[10px] font-medium
                          text-text-muted uppercase tracking-wider">
                            {group.section}
                        </p>

                        {/* Nav links */}
                        {group.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-2.5 px-4 py-2.5 mx-2
                   rounded-lg text-sm transition-colors duration-150
                   ${isActive
                                        ? 'bg-primary/20 text-primary-light font-medium'
                                        : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                                    }`
                                }
                            >
                                <item.icon size={16} />
                                {item.label}
                            </NavLink>
                        ))}

                    </div>
                ))}
            </nav>

            {/* User block + logout */}
            <div className="border-t border-border p-4">
                <div className="flex items-center gap-3 mb-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-primary/30
                          flex items-center justify-center
                          text-primary-light text-xs font-semibold
                          flex-shrink-0">
                        {getInitials(user?.name)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                            {user?.email || ''}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2
                     rounded-lg text-sm text-text-muted
                     hover:bg-danger/10 hover:text-danger
                     transition-colors duration-150"
                >
                    <LogOut size={15} />
                    Sign out
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;