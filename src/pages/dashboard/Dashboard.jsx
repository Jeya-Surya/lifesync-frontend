import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Flame, Briefcase, Bot } from 'lucide-react';
import { goalApi } from '../../api/goalApi';
import { habitApi } from '../../api/habitApi';
import { jobApi } from '../../api/jobApi';
import MetricCard from '../../components/common/MetricCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
const Dashboard = () => {

    const navigate = useNavigate();

    const [goals, setGoals] = useState([]);
    const [habits, setHabits] = useState([]);
    const [jobStats, setJobStats] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [goalsRes, habitsRes, statsRes] = await Promise.all([
                goalApi.getAll(),
                habitApi.getAll(),
                jobApi.getStats()
            ]);
            setGoals(goalsRes.data)
            setHabits(habitsRes.data);
            setJobStats(statsRes.data);
        } catch (err) {
            toast.error("Failed to load dashboard data");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleCheckIn = async (habitId) => {
        try {
            await habitApi.checkIn(habitId);
            toast.success("Checked in! 🔥");
            fetchDashboardData();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Already checked in today"
            )
        }
    }

    if (loading) return <LoadingSpinner text={"Loading your dashboard..."} />

    const activeGoals = goals.filter(g => g.status === "IN_PROGRESS");
    const bestStreak = habits.length > 0
        ? Math.max(...habits.map(h => h.currentStreak))
        : 0;

    const habitsDoneToday = habits.filter(h => h.checkedInToday).length;

    return (
        <div className="max-w-6xl mx-auto">

            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <MetricCard
                    label="Active goals"
                    value={activeGoals.length}
                    sub={`${goals.filter(g => g.status === 'COMPLETED').length} completed`}
                    icon={Target}
                />
                <MetricCard
                    label="Best streak"
                    value={`${bestStreak} days`}
                    sub="Keep it going!"
                    icon={Flame}
                    color="text-warning"
                />
                <MetricCard
                    label="Applications"
                    value={jobStats?.totalApplications || 0}
                    sub={`${jobStats?.interviews || 0} interviews`}
                    icon={Briefcase}
                    color="text-success"
                />
                <MetricCard
                    label="Habits today"
                    value={`${habitsDoneToday} / ${habits.length}`}
                    sub={habitsDoneToday === habits.length
                        ? 'All done! 🎉'
                        : `${habits.length - habitsDoneToday} remaining`}
                    icon={Bot}
                    color="text-primary-light"
                />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-2 gap-6">

                {/* Today's Habits */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-text-primary
                           flex items-center gap-2">
                            <Flame size={15} className="text-warning" />
                            Today's habits
                        </h2>
                        <span className="badge badge-purple">
              {habitsDoneToday} / {habits.length} done
            </span>
                    </div>

                    {habits.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-text-muted text-sm mb-3">
                                No habits yet
                            </p>
                            <button
                                onClick={() => navigate('/habits')}
                                className="btn-primary w-auto px-4 text-xs py-2"
                            >
                                Add your first habit
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {habits.map(habit => (
                                <div
                                    key={habit.id}
                                    className="flex items-center justify-between
                             py-2.5 border-b border-border last:border-0"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">
                                            {habit.name}
                                        </p>
                                        <p className="text-xs text-text-muted mt-0.5">
                                            {habit.currentStreak > 0
                                                ? `🔥 ${habit.currentStreak} day streak`
                                                : 'Start your streak today'}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleCheckIn(habit.id)}
                                        disabled={habit.checkedInToday}
                                        className={`w-8 h-8 rounded-full border-2 flex
                                items-center justify-center text-sm
                                transition-colors duration-150
                                ${habit.checkedInToday
                                            ? 'bg-primary border-primary text-white'
                                            : 'border-border text-text-muted hover:border-primary hover:text-primary'
                                        }`}
                                    >
                                        {habit.checkedInToday ? '✓' : ''}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Goal Progress */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-text-primary
                           flex items-center gap-2">
                            <Target size={15} className="text-primary-light" />
                            Goal progress
                        </h2>
                        <button
                            onClick={() => navigate('/goals')}
                            className="text-xs text-primary-light hover:text-primary
                         transition-colors"
                        >
                            View all
                        </button>
                    </div>

                    {activeGoals.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-text-muted text-sm mb-3">
                                No active goals
                            </p>
                            <button
                                onClick={() => navigate('/goals')}
                                className="btn-primary w-auto px-4 text-xs py-2"
                            >
                                Create a goal
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeGoals.slice(0, 4).map(goal => (
                                <div key={goal.id}>
                                    <div className="flex items-center
                                  justify-between mb-1.5">
                                        <p className="text-sm font-medium text-text-primary
                                  truncate max-w-[200px]">
                                            {goal.title}
                                        </p>
                                        <span className="text-sm font-semibold text-primary-light">
                      {goal.progressPercent}%
                    </span>
                                    </div>
                                    <p className="text-xs text-text-muted mb-1.5">
                                        {goal.targetDate
                                            ? `Due: ${new Date(goal.targetDate)
                                                .toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric',
                                                    year: 'numeric'
                                                })}`
                                            : 'No deadline set'}
                                    </p>
                                    {/* Progress bar */}
                                    <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full
                                 transition-all duration-500"
                                            style={{ width: `${goal.progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Job Stats */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-text-primary
                           flex items-center gap-2">
                            <Briefcase size={15} className="text-success" />
                            Job hunt
                        </h2>
                        <button
                            onClick={() => navigate('/jobs')}
                            className="text-xs text-primary-light hover:text-primary
                         transition-colors"
                        >
                            View all
                        </button>
                    </div>

                    {!jobStats || jobStats.totalApplications === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-text-muted text-sm mb-3">
                                No applications yet
                            </p>
                            <button
                                onClick={() => navigate('/jobs')}
                                className="btn-primary w-auto px-4 text-xs py-2"
                            >
                                Track application
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Applied',     value: jobStats.applied,     color: 'text-text-primary' },
                                { label: 'Shortlisted', value: jobStats.shortlisted, color: 'text-primary-light' },
                                { label: 'Interviews',  value: jobStats.interviews,  color: 'text-warning' },
                                { label: 'Offers',      value: jobStats.offers,      color: 'text-success' },
                                { label: 'Rejected',    value: jobStats.rejected,    color: 'text-danger' },
                                { label: 'Total',       value: jobStats.totalApplications, color: 'text-text-primary' },
                            ].map(stat => (
                                <div
                                    key={stat.label}
                                    className="bg-surface-2 rounded-xl p-3 text-center"
                                >
                                    <p className={`text-xl font-semibold ${stat.color}`}>
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-text-muted mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* AI Coach Snippet */}
                <div className="card bg-primary/10 border-primary/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-primary flex
                            items-center justify-center flex-shrink-0">
                            <Bot size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-text-primary">
                                AI Coach
                            </p>
                            <p className="text-xs text-primary-light">
                                Powered by Groq · llama-3.3-70b
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed mb-4">
                        Get your personalized morning briefing — AI analyzes
                        your goals, habits, and job applications to tell you
                        exactly what to focus on today.
                    </p>

                    <button
                        onClick={() => navigate('/coach')}
                        className="btn-primary text-xs py-2.5"
                    >
                        Get today's briefing →
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;