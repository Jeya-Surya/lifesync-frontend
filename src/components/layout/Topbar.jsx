import useAuthStore from "../../store/authStore.js";
import { Bell } from 'lucide-react';

const Topbar = ({title, subtitle}) => {
    const {user} = useAuthStore();

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) return "Good morning"
        else if (hour < 17) return  "Good afternoon"
        else return "Good evening"
    }

    const getDate = () => {
        return new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    return (
        <header className="h-16 bg-surface border-b border-border
                       flex items-center justify-between
                       px-6 sticky top-0 z-10">

            {/* Left — page title or greeting */}
            <div>
                {title ? (
                    <>
                        <h1 className="text-base font-semibold text-text-primary">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xs text-text-muted">{subtitle}</p>
                        )}
                    </>
                ) : (
                    <>
                        <h1 className="text-base font-semibold text-text-primary">
                            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
                        </h1>
                        <p className="text-xs text-text-muted">{getDate()}</p>
                    </>
                )}
            </div>

            {/* Right — actions */}
            <div className="flex items-center gap-3">
                <button className="w-9 h-9 flex items-center justify-center
                           rounded-lg border border-border
                           text-text-secondary hover:text-text-primary
                           hover:bg-surface-2 transition-colors">
                    <Bell size={16} />
                </button>
            </div>

        </header>
    );
}

export default Topbar;