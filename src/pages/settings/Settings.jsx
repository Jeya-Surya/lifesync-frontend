import useAuthStore from "../../store/authStore.js"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out');
    };

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-semibold text-text-primary mb-6">
                ⚙️ Settings
            </h1>
            <div className="card mb-4">
                <h2 className="text-sm font-semibold text-text-secondary
                       uppercase tracking-wider mb-4">
                    Profile
                </h2>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/30
                          flex items-center justify-center
                          text-primary-light font-semibold text-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-primary">
                            {user?.name}
                        </p>
                        <p className="text-xs text-text-muted">{user?.email}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                            Role: {user?.role}
                        </p>
                    </div>
                </div>
            </div>
            <div className="card">
                <h2 className="text-sm font-semibold text-text-secondary
                       uppercase tracking-wider mb-4">
                    Account
                </h2>
                <button
                    onClick={handleLogout}
                    className="btn-secondary w-auto px-6 text-danger
                     border-danger/30 hover:bg-danger/10"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
};

export default Settings;