import { useState, useEffect } from 'react';
import { Target, Plus, Trash2, CheckCircle, Circle,
    ChevronDown, ChevronUp } from 'lucide-react';
import { goalApi } from '../../api/goalApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [expandedGoal, setExpandedGoal] = useState(null);
    const [showMilestoneForm, setShowMilestoneForm] = useState(null);

    // Form state
    const [goalForm, setGoalForm] = useState({
        title: '', description: '', targetDate: ''
    });
    const [milestoneForm, setMilestoneForm] = useState({
        title: '', dueDate: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const res = await goalApi.getAll();
            setGoals(res.data);
        } catch {
            toast.error('Failed to load goals');
        } finally {
            setLoading(false);
        }
    };

    // Create goal
    const handleCreateGoal = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await goalApi.create(goalForm);
            toast.success('Goal created! 🎯');
            setGoalForm({ title: '', description: '', targetDate: '' });
            setShowForm(false);
            fetchGoals();
        } catch {
            toast.error('Failed to create goal');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete goal
    const handleDeleteGoal = async (goalId) => {
        if (!confirm('Delete this goal and all its milestones?')) return;
        try {
            await goalApi.delete(goalId);
            toast.success('Goal deleted');
            fetchGoals();
        } catch {
            toast.error('Failed to delete goal');
        }
    };

    // Add milestone
    const handleAddMilestone = async (e, goalId) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await goalApi.addMilestone(goalId, milestoneForm);
            toast.success('Milestone added');
            setMilestoneForm({ title: '', dueDate: '' });
            setShowMilestoneForm(null);
            fetchGoals();
        } catch {
            toast.error('Failed to add milestone');
        } finally {
            setSubmitting(false);
        }
    };

    // Complete milestone
    const handleCompleteMilestone = async (goalId, milestoneId) => {
        console.log('Completing milestone:', goalId, milestoneId);
        try {
            const res = await goalApi.completeMilestone(goalId, milestoneId);
            console.log('Success:', res.data);
            toast.success('Milestone completed! ✅');
            fetchGoals();
        } catch (err) {
            console.error('Status:', err.response?.status);
            console.error('Error:', err.response?.data);
            console.error('URL:', err.config?.url);
            toast.error(
                err.response?.data?.message || 'Failed to complete milestone'
            );
        }
    };

    // Delete milestone
    const handleDeleteMilestone = async (goalId, milestoneId) => {
        try {
            await goalApi.deleteMilestone(goalId, milestoneId);
            toast.success('Milestone deleted');
            fetchGoals();
        } catch {
            toast.error('Failed to delete milestone');
        }
    };

    // Status badge styles
    const getStatusBadge = (status) => {
        const map = {
            IN_PROGRESS: 'badge-purple',
            COMPLETED:   'badge-green',
            ABANDONED:   'badge-red',
        };
        return map[status] || 'badge-purple';
    };

    if (loading) return <LoadingSpinner text="Loading goals..." />;

    return (
        <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-text-primary
                         flex items-center gap-2">
                        <Target size={20} className="text-primary-light" />
                        Goals & Milestones
                    </h1>
                    <p className="text-sm text-text-muted mt-0.5">
                        {goals.length} goals · {
                        goals.filter(g => g.status === 'IN_PROGRESS').length
                    } in progress
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary w-auto flex items-center gap-2 px-4"
                >
                    <Plus size={16} />
                    New goal
                </button>
            </div>

            {/* Create goal form */}
            {showForm && (
                <div className="card mb-6 border-primary/40">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">
                        Create new goal
                    </h3>
                    <form onSubmit={handleCreateGoal} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Goal title *"
                            value={goalForm.title}
                            onChange={e => setGoalForm({
                                ...goalForm, title: e.target.value
                            })}
                            required
                            className="input-field"
                        />
                        <textarea
                            placeholder="Description (optional)"
                            value={goalForm.description}
                            onChange={e => setGoalForm({
                                ...goalForm, description: e.target.value
                            })}
                            rows={2}
                            className="input-field resize-none"
                        />
                        <div>
                            <label className="block text-xs text-text-muted mb-1">
                                Target date (optional)
                            </label>
                            <input
                                type="date"
                                value={goalForm.targetDate}
                                onChange={e => setGoalForm({
                                    ...goalForm, targetDate: e.target.value
                                })}
                                className="input-field"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>
                        <div className="flex gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary w-auto px-6"
                            >
                                {submitting ? 'Creating...' : 'Create goal'}
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

            {/* Goals list */}
            {goals.length === 0 ? (
                <EmptyState
                    icon="🎯"
                    title="No goals yet"
                    description="Set your first goal and break it down into milestones to track your progress."
                    action={
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary w-auto px-6"
                        >
                            Create your first goal
                        </button>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {goals.map(goal => (
                        <div key={goal.id} className="card">

                            {/* Goal header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0 mr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-semibold
                                   text-text-primary truncate">
                                            {goal.title}
                                        </h3>
                                        <span className={`badge ${getStatusBadge(goal.status)}
                                      flex-shrink-0`}>
                      {goal.status.replace('_', ' ')}
                    </span>
                                    </div>
                                    {goal.description && (
                                        <p className="text-xs text-text-muted mb-2">
                                            {goal.description}
                                        </p>
                                    )}
                                    {goal.targetDate && (
                                        <p className="text-xs text-text-muted">
                                            Due:{' '}
                                            {new Date(goal.targetDate).toLocaleDateString(
                                                'en-US', {
                                                    month: 'long', day: 'numeric', year: 'numeric'
                                                }
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-semibold text-primary-light">
                    {goal.progressPercent}%
                  </span>
                                    <button
                                        onClick={() => handleDeleteGoal(goal.id)}
                                        className="p-1.5 rounded-lg text-text-muted
                               hover:text-danger hover:bg-danger/10
                               transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => setExpandedGoal(
                                            expandedGoal === goal.id ? null : goal.id
                                        )}
                                        className="p-1.5 rounded-lg text-text-muted
                               hover:text-text-primary hover:bg-surface-2
                               transition-colors"
                                    >
                                        {expandedGoal === goal.id
                                            ? <ChevronUp size={14} />
                                            : <ChevronDown size={14} />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1.5 bg-surface-2 rounded-full
                              overflow-hidden mb-3">
                                <div
                                    className="h-full bg-primary rounded-full
                             transition-all duration-500"
                                    style={{ width: `${goal.progressPercent}%` }}
                                />
                            </div>

                            {/* Milestones — shown when expanded */}
                            {expandedGoal === goal.id && (
                                <div className="mt-4 pt-4 border-t border-border">

                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs font-medium text-text-secondary
                                  uppercase tracking-wider">
                                            Milestones ({goal.milestones?.length || 0})
                                        </p>
                                        <button
                                            onClick={() => setShowMilestoneForm(
                                                showMilestoneForm === goal.id ? null : goal.id
                                            )}
                                            className="text-xs text-primary-light
                                 hover:text-primary flex items-center gap-1
                                 transition-colors"
                                        >
                                            <Plus size={12} />
                                            Add milestone
                                        </button>
                                    </div>

                                    {/* Add milestone form */}
                                    {showMilestoneForm === goal.id && (
                                        <form
                                            onSubmit={e => handleAddMilestone(e, goal.id)}
                                            className="mb-4 p-3 bg-surface-2 rounded-xl
                                 space-y-2"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Milestone title *"
                                                value={milestoneForm.title}
                                                onChange={e => setMilestoneForm({
                                                    ...milestoneForm, title: e.target.value
                                                })}
                                                required
                                                className="input-field text-xs py-2"
                                            />
                                            <input
                                                type="date"
                                                value={milestoneForm.dueDate}
                                                onChange={e => setMilestoneForm({
                                                    ...milestoneForm, dueDate: e.target.value
                                                })}
                                                className="input-field text-xs py-2"
                                                style={{ colorScheme: 'dark' }}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="btn-primary w-auto px-4
                                     text-xs py-1.5"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowMilestoneForm(null)}
                                                    className="btn-secondary w-auto px-4
                                     text-xs py-1.5"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Milestones list */}
                                    {!goal.milestones || goal.milestones.length === 0 ? (
                                        <p className="text-xs text-text-muted py-3 text-center">
                                            No milestones yet — add one above
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {goal.milestones.map(milestone => (
                                                <div
                                                    key={milestone.id}
                                                    className="flex items-center gap-3 py-2 group"
                                                >
                                                    {/* Complete button */}
                                                    <button
                                                        onClick={() => !milestone.isCompleted &&
                                                            handleCompleteMilestone(goal.id, milestone.id)
                                                        }
                                                        disabled={milestone.isCompleted}
                                                        className="flex-shrink-0 transition-colors"
                                                    >
                                                        {milestone.isCompleted
                                                            ? <CheckCircle size={16} className="text-success" />
                                                            : <Circle size={16}
                                                                      className="text-text-muted hover:text-primary" />
                                                        }
                                                    </button>

                                                    {/* Milestone details */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* Title — with fallback */}
                                                        <p className={`text-xs font-medium
                    ${milestone.isCompleted
                                                            ? 'line-through text-text-muted'
                                                            : 'text-text-primary'
                                                        }`}>
                                                            {milestone.title}
                                                        </p>

                                                        {/* Due date */}
                                                        {milestone.dueDate && (
                                                            <p className="text-[10px] text-text-muted mt-0.5">
                                                                Due:{' '}
                                                                {new Date(milestone.dueDate).toLocaleDateString(
                                                                    'en-US', { month: 'short', day: 'numeric' }
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => handleDeleteMilestone(
                                                            goal.id, milestone.id
                                                        )}
                                                        className="opacity-0 group-hover:opacity-100
                 p-1 rounded text-text-muted
                 hover:text-danger transition-all duration-150"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Goals;