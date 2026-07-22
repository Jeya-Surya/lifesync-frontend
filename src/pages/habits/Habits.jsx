import { useState, useEffect } from 'react';
import { Flame, Plus, Trash2, CheckCircle } from 'lucide-react';
import { habitApi } from '../../api/habitApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

// ── Heatmap Component ─────────────────────────────────────────
const HabitHeatmap = ({ logs }) => {
    const checkedDates = new Set(
        (logs || []).map(log =>
            log.checkDate ? log.checkDate.toString().split('T')[0] : null
        ).filter(Boolean)
    );

    // Generate last 91 days
    const days = [];
    for (let i = 90; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        days.push({
            date: dateStr,
            done: checkedDates.has(dateStr),
        });
    }

    // Split into 13 weeks of 7 days each
    const weeks = [];
    for (let i = 0; i < 13; i++) {
        weeks.push(days.slice(i * 7, i * 7 + 7));
    }

    return (
        <div className="mt-4">
            <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1 flex-1">
                        {week.map((day, dayIndex) => (
                            <div
                                key={dayIndex}
                                title={`${day.date}${day.done ? ' ✓' : ''}`}
                                className={`h-3 rounded-sm transition-colors duration-200
                  ${day.done
                                    ? 'bg-primary'
                                    : 'bg-surface-2 border border-border/50'
                                }`}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-text-muted">Less</span>
                <div className="h-2.5 w-2.5 rounded-sm bg-surface-2
                        border border-border/50" />
                <div className="h-2.5 w-2.5 rounded-sm bg-primary/30" />
                <div className="h-2.5 w-2.5 rounded-sm bg-primary/60" />
                <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
                <span className="text-[10px] text-text-muted">More</span>
            </div>
        </div>
    );
};

// ── Habit Card Component ──────────────────────────────────────
const HabitCard = ({ habit, onCheckIn, onDelete }) => {
    const [logs, setLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchLogs = async () => {
            try {
                const res = await habitApi.getLogs(habit.id);
                if (!cancelled) {
                    setLogs(res.data);
                }
            } catch {
                // silently fail — heatmap shows empty
            } finally {
                if (!cancelled) {
                    setLoadingLogs(false);
                }
            }
        };

        fetchLogs();

        return () => {
            cancelled = true;
        };
    }, [habit.id]);

    return (
        <div className="card">

            {/* Header */}
            <div className="flex items-start justify-between mb-1">
                <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-text-primary">
                            {habit.name}
                        </h3>
                        <span className="badge badge-purple text-[10px]">
              {habit.frequency}
            </span>
                    </div>
                    {habit.description && (
                        <p className="text-xs text-text-muted mt-0.5">
                            {habit.description}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Check-in button */}
                    <button
                        onClick={() => onCheckIn(habit.id)}
                        disabled={habit.checkedInToday}
                        title={habit.checkedInToday
                            ? 'Already checked in today'
                            : 'Check in for today'}
                        className={`flex items-center gap-1.5 px-3 py-1.5
                        rounded-lg text-xs font-medium
                        transition-colors duration-150
                        ${habit.checkedInToday
                            ? 'bg-success/20 text-success cursor-default'
                            : 'bg-primary/20 text-primary-light hover:bg-primary/30'
                        }`}
                    >
                        {habit.checkedInToday
                            ? <><CheckCircle size={12} /> Done</>
                            : <><Flame size={12} /> Check in</>
                        }
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() => onDelete(habit.id)}
                        className="p-1.5 rounded-lg text-text-muted
                       hover:text-danger hover:bg-danger/10
                       transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Streak info */}
            <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1.5">
                    <Flame size={13} className="text-warning" />
                    <span className="text-xs text-text-secondary">
            Current streak:
          </span>
                    <span className="text-xs font-semibold text-warning">
            {habit.currentStreak} days
          </span>
                </div>
                <div className="flex items-center gap-1.5">
          <span className="text-xs text-text-muted">
            Best: {habit.longestStreak} days
          </span>
                </div>
            </div>

            {/* Heatmap */}
            {loadingLogs
                ? <div className="h-10 bg-surface-2 rounded animate-pulse
                          mt-4" />
                : <HabitHeatmap logs={logs} />
            }

        </div>
    );
};

// ── Main Habits Page ──────────────────────────────────────────
const Habits = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        frequency: 'DAILY',
    });

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const res = await habitApi.getAll();
            setHabits(res.data);
        } catch {
            toast.error('Failed to load habits');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHabit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await habitApi.create(form);
            toast.success('Habit created! 🔥');
            setForm({ name: '', description: '', frequency: 'DAILY' });
            setShowForm(false);
            fetchHabits();
        } catch {
            toast.error('Failed to create habit');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCheckIn = async (habitId) => {
        try {
            const res = await habitApi.checkIn(habitId);
            toast.success(
                `Checked in! Streak: ${res.data.currentStreak} days 🔥`
            );
            fetchHabits();
        } catch (err) {
            toast.error(
                err.response?.data?.message || 'Already checked in today'
            );
        }
    };

    const handleDelete = async (habitId) => {
        if (!confirm('Delete this habit and all its history?')) return;
        try {
            await habitApi.delete(habitId);
            toast.success('Habit deleted');
            fetchHabits();
        } catch {
            toast.error('Failed to delete habit');
        }
    };

    if (loading) return <LoadingSpinner text="Loading habits..." />;

    const doneToday = habits.filter(h => h.checkedInToday).length;
    const bestStreak = habits.length > 0
        ? Math.max(...habits.map(h => h.longestStreak))
        : 0;

    return (
        <div className="max-w-4xl mx-auto">

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-text-primary
                         flex items-center gap-2">
                        <Flame size={20} className="text-warning" />
                        Habit Tracker
                    </h1>
                    <p className="text-sm text-text-muted mt-0.5">
                        {doneToday} / {habits.length} done today
                        {bestStreak > 0 && ` · Best streak: ${bestStreak} days`}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary w-auto flex items-center gap-2 px-4"
                >
                    <Plus size={16} />
                    New habit
                </button>
            </div>

            {/* Today's progress bar */}
            {habits.length > 0 && (
                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-text-secondary">
                            Today's progress
                        </p>
                        <p className="text-xs font-semibold text-primary-light">
                            {Math.round((doneToday / habits.length) * 100)}%
                        </p>
                    </div>
                    <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full
                         transition-all duration-700"
                            style={{
                                width: `${(doneToday / habits.length) * 100}%`
                            }}
                        />
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                        {doneToday === habits.length
                            ? '🎉 All habits done for today!'
                            : `${habits.length - doneToday} habits remaining`
                        }
                    </p>
                </div>
            )}

            {/* Create habit form */}
            {showForm && (
                <div className="card mb-6 border-primary/40">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">
                        Create new habit
                    </h3>
                    <form onSubmit={handleCreateHabit} className="space-y-3">

                        <input
                            type="text"
                            placeholder="Habit name *"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                            className="input-field"
                        />

                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={form.description}
                            onChange={e => setForm({
                                ...form, description: e.target.value
                            })}
                            className="input-field"
                        />

                        <div>
                            <label className="block text-xs text-text-muted mb-1">
                                Frequency
                            </label>
                            <select
                                value={form.frequency}
                                onChange={e => setForm({
                                    ...form, frequency: e.target.value
                                })}
                                className="input-field"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="DAILY">Daily</option>
                                <option value="WEEKLY">Weekly</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary w-auto px-6"
                            >
                                {submitting ? 'Creating...' : 'Create habit'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="btn-secondary w-auto px-6"
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {/* Habits list */}
            {habits.length === 0 ? (
                <EmptyState
                    icon="🔥"
                    title="No habits yet"
                    description="Build consistency by tracking daily habits. Start with one small habit and grow from there."
                    action={
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary w-auto px-6"
                        >
                            Create your first habit
                        </button>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {habits.map(habit => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onCheckIn={handleCheckIn}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default Habits;