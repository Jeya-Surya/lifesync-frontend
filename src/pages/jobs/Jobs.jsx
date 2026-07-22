import { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, ChevronDown,
    ChevronUp, ExternalLink, X } from 'lucide-react';
import { jobApi } from '../../api/jobApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

// ── Status config ─────────────────────────────────────────────
const STATUSES = [
    { key: 'APPLIED',      label: 'Applied',      color: 'text-text-secondary',  bg: 'bg-surface-2'      },
    { key: 'SHORTLISTED',  label: 'Shortlisted',  color: 'text-primary-light',   bg: 'bg-primary/10'     },
    { key: 'INTERVIEW',    label: 'Interview',    color: 'text-warning',          bg: 'bg-warning/10'     },
    { key: 'OFFER',        label: 'Offer',        color: 'text-success',          bg: 'bg-success/10'     },
    { key: 'REJECTED',     label: 'Rejected',     color: 'text-danger',           bg: 'bg-danger/10'      },
];

// ── Status Badge ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = STATUSES.find(s => s.key === status);
    if (!config) return null;
    return (
        <span className={`badge text-[10px] ${config.color}
                      ${config.bg}`}>
      {config.label}
    </span>
    );
};

// ── Application Detail Modal ──────────────────────────────────
const AppDetailModal = ({ app, onClose, onUpdate }) => {
    const [rounds, setRounds] = useState([]);
    const [showRoundForm, setShowRoundForm] = useState(false);
    const [roundForm, setRoundForm] = useState({
        roundName: '', roundDate: '', notes: '', outcome: 'PENDING'
    });
    const [submitting, setSubmitting] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchRounds();
    }, [app.id]);

    const fetchRounds = async () => {
        try {
            const res = await jobApi.getRounds(app.id);
            setRounds(res.data);
        } catch {
            // silently fail
        }
    };

    const handleAddRound = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await jobApi.addRound(app.id, roundForm);
            toast.success('Interview round added');
            setRoundForm({
                roundName: '', roundDate: '', notes: '', outcome: 'PENDING'
            });
            setShowRoundForm(false);
            fetchRounds();
            onUpdate();
        } catch {
            toast.error('Failed to add round');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            await jobApi.updateStatus(app.id, newStatus);
            toast.success(`Status updated to ${newStatus}`);
            onUpdate();
            onClose();
        } catch {
            toast.error('Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const outcomeColor = (outcome) => {
        if (outcome === 'PASSED') return 'text-success';
        if (outcome === 'FAILED') return 'text-danger';
        return 'text-text-muted';
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm
                    flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border rounded-2xl
                      w-full max-w-lg max-h-[85vh] overflow-y-auto">

                {/* Modal header */}
                <div className="flex items-start justify-between p-5
                        border-b border-border">
                    <div>
                        <h2 className="text-base font-semibold text-text-primary">
                            {app.companyName}
                        </h2>
                        <p className="text-sm text-text-muted mt-0.5">
                            {app.role}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <StatusBadge status={app.status} />
                            {app.appliedDate && (
                                <span className="text-xs text-text-muted">
                  Applied: {new Date(app.appliedDate)
                                    .toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-text-muted
                       hover:text-text-primary hover:bg-surface-2
                       transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-5 space-y-5">

                    {/* Notes */}
                    {app.notes && (
                        <div>
                            <p className="text-xs font-medium text-text-secondary
                            uppercase tracking-wider mb-1.5">
                                Notes
                            </p>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {app.notes}
                            </p>
                        </div>
                    )}

                    {app.jobUrl && (
                        <div>
                            <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="flex items-center gap-2 text-xs text-primary-light hover:text-primary transition-colors"
                            >
                                <ExternalLink size={12} />
                                View job posting
                            </a>
                        </div>
                        )}

                    {/* Follow up */}
                    {app.followUpDate && (
                        <div className="flex items-center gap-2 p-3
                            bg-warning/10 rounded-xl">
              <span className="text-warning text-xs font-medium">
                📅 Follow up by:{' '}
                  {new Date(app.followUpDate).toLocaleDateString(
                      'en-US', {
                          month: 'long', day: 'numeric', year: 'numeric'
                      }
                  )}
              </span>
                        </div>
                    )}

                    {/* Update status */}
                    <div>
                        <p className="text-xs font-medium text-text-secondary
                          uppercase tracking-wider mb-2">
                            Update status
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {STATUSES.map(s => (
                                <button
                                    key={s.key}
                                    onClick={() => handleStatusChange(s.key)}
                                    disabled={app.status === s.key || updatingStatus}
                                    className={`px-3 py-1.5 rounded-lg text-xs
                              font-medium transition-colors
                              ${app.status === s.key
                                        ? `${s.bg} ${s.color} cursor-default`
                                        : 'bg-surface-2 text-text-muted hover:bg-surface border border-border'
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interview rounds */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-medium text-text-secondary
                            uppercase tracking-wider">
                                Interview rounds ({rounds.length})
                            </p>
                            <button
                                onClick={() => setShowRoundForm(!showRoundForm)}
                                className="text-xs text-primary-light
                           hover:text-primary flex items-center gap-1
                           transition-colors"
                            >
                                <Plus size={12} />
                                Add round
                            </button>
                        </div>

                        {/* Add round form */}
                        {showRoundForm && (
                            <form
                                onSubmit={handleAddRound}
                                className="mb-4 p-3 bg-surface-2 rounded-xl space-y-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Round name * (e.g. Technical Round 1)"
                                    value={roundForm.roundName}
                                    onChange={e => setRoundForm({
                                        ...roundForm, roundName: e.target.value
                                    })}
                                    required
                                    className="input-field text-xs py-2"
                                />
                                <input
                                    type="date"
                                    value={roundForm.roundDate}
                                    onChange={e => setRoundForm({
                                        ...roundForm, roundDate: e.target.value
                                    })}
                                    className="input-field text-xs py-2"
                                    style={{ colorScheme: 'dark' }}
                                />
                                <textarea
                                    placeholder="Notes (questions asked, feedback...)"
                                    value={roundForm.notes}
                                    onChange={e => setRoundForm({
                                        ...roundForm, notes: e.target.value
                                    })}
                                    rows={2}
                                    className="input-field text-xs py-2 resize-none"
                                />
                                <select
                                    value={roundForm.outcome}
                                    onChange={e => setRoundForm({
                                        ...roundForm, outcome: e.target.value
                                    })}
                                    className="input-field text-xs py-2"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PASSED">Passed</option>
                                    <option value="FAILED">Failed</option>
                                </select>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary w-auto px-4 text-xs py-1.5"
                                    >
                                        {submitting ? 'Adding...' : 'Add'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRoundForm(false)}
                                        className="btn-secondary w-auto px-4 text-xs py-1.5"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Rounds list */}
                        {rounds.length === 0 ? (
                            <p className="text-xs text-text-muted py-3 text-center">
                                No interview rounds yet
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {rounds.map(round => (
                                    <div
                                        key={round.id}
                                        className="p-3 bg-surface-2 rounded-xl"
                                    >
                                        <div className="flex items-center
                                    justify-between mb-1">
                                            <p className="text-xs font-semibold
                                    text-text-primary">
                                                {round.roundName}
                                            </p>
                                            <span className={`text-[10px] font-medium
                                        ${outcomeColor(round.outcome)}`}>
                        {round.outcome}
                      </span>
                                        </div>
                                        {round.roundDate && (
                                            <p className="text-[10px] text-text-muted mb-1">
                                                {new Date(round.roundDate).toLocaleDateString(
                                                    'en-US', {
                                                        month: 'short', day: 'numeric',
                                                        year: 'numeric'
                                                    }
                                                )}
                                            </p>
                                        )}
                                        {round.notes && (
                                            <p className="text-xs text-text-secondary
                                    leading-relaxed">
                                                {round.notes}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

// ── Application Card ──────────────────────────────────────────
const AppCard = ({ app, onClick, onDelete }) => (
    <div
        className="bg-surface border border-border rounded-xl p-3
               mb-2 cursor-pointer hover:border-primary/40
               transition-colors duration-150"
        onClick={onClick}
    >
        <p className="text-xs font-semibold text-text-primary mb-0.5">
            {app.companyName}
        </p>
        <p className="text-[11px] text-text-secondary mb-2">
            {app.role}
        </p>
        {app.appliedDate && (
            <p className="text-[10px] text-text-muted mb-2">
                {new Date(app.appliedDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric'
                })}
            </p>
        )}
        {app.followUpDate && (
            <p className="text-[10px] text-warning">
                Follow up: {new Date(app.followUpDate).toLocaleDateString(
                'en-US', { month: 'short', day: 'numeric' }
            )}
            </p>
        )}
        <div className="flex items-center justify-between mt-2">
      <span className="text-[10px] text-text-muted">
        Click to view details
      </span>
            <button
                onClick={e => { e.stopPropagation(); onDelete(app.id); }}
                className="p-1 rounded text-text-muted hover:text-danger
                   hover:bg-danger/10 transition-colors"
            >
                <Trash2 size={11} />
            </button>
        </div>
    </div>
);

// ── Main Jobs Page ────────────────────────────────────────────
const Jobs = () => {
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        companyName: '',
        role: '',
        appliedDate: new Date().toISOString().split('T')[0],
        followUpDate: '',
        notes: '',
        jobUrl: '',
    });

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [appsRes, statsRes] = await Promise.all([
                jobApi.getAll(),
                jobApi.getStats(),
            ]);
            setApplications(appsRes.data);
            setStats(statsRes.data);
        } catch {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await jobApi.create(form);
            toast.success('Application added! 💼');
            setForm({
                companyName: '',
                role: '',
                appliedDate: new Date().toISOString().split('T')[0],
                followUpDate: '',
                notes: '',
                jobUrl: '',
            });
            setShowForm(false);
            fetchAll();
        } catch {
            toast.error('Failed to add application');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (appId) => {
        if (!confirm('Delete this application?')) return;
        try {
            await jobApi.delete(appId);
            toast.success('Application deleted');
            fetchAll();
        } catch {
            toast.error('Failed to delete');
        }
    };

    // Group applications by status for Kanban
    const getAppsForStatus = (status) =>
        applications.filter(app => app.status === status);

    if (loading) return <LoadingSpinner text="Loading applications..." />;

    return (
        <div className="max-w-full">

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-text-primary
                         flex items-center gap-2">
                        <Briefcase size={20} className="text-success" />
                        Job Tracker
                    </h1>
                    <p className="text-sm text-text-muted mt-0.5">
                        Track every application · never miss a follow-up
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary w-auto flex items-center gap-2 px-4"
                >
                    <Plus size={16} />
                    Add application
                </button>
            </div>

            {/* Stats bar */}
            {stats && (
                <div className="grid grid-cols-6 gap-3 mb-6">
                    {[
                        { label: 'Total',       value: stats.totalApplications, color: 'text-text-primary'  },
                        { label: 'Applied',     value: stats.applied,           color: 'text-text-secondary' },
                        { label: 'Shortlisted', value: stats.shortlisted,       color: 'text-primary-light'  },
                        { label: 'Interviews',  value: stats.interviews,        color: 'text-warning'        },
                        { label: 'Offers',      value: stats.offers,            color: 'text-success'        },
                        { label: 'Rejected',    value: stats.rejected,          color: 'text-danger'         },
                    ].map(stat => (
                        <div key={stat.label} className="card text-center py-3">
                            <p className={`text-xl font-semibold ${stat.color}`}>
                                {stat.value}
                            </p>
                            <p className="text-[10px] text-text-muted mt-1">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Add application form */}
            {showForm && (
                <div className="card mb-6 border-primary/40">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">
                        Add new application
                    </h3>
                    <form onSubmit={handleCreate} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Company name *"
                                value={form.companyName}
                                onChange={e => setForm({
                                    ...form, companyName: e.target.value
                                })}
                                required
                                className="input-field"
                            />
                            <input
                                type="text"
                                placeholder="Role *"
                                value={form.role}
                                onChange={e => setForm({ ...form, role: e.target.value })}
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">
                                    Applied date
                                </label>
                                <input
                                    type="date"
                                    value={form.appliedDate}
                                    onChange={e => setForm({
                                        ...form, appliedDate: e.target.value
                                    })}
                                    className="input-field"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">
                                    Follow-up date
                                </label>
                                <input
                                    type="date"
                                    value={form.followUpDate}
                                    onChange={e => setForm({
                                        ...form, followUpDate: e.target.value
                                    })}
                                    className="input-field"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        </div>
                        <input
                            type="url"
                            placeholder="Job posting URL (optional)"
                            value={form.jobUrl}
                            onChange={e => setForm({ ...form, jobUrl: e.target.value })}
                            className="input-field"
                        />
                        <textarea
                            placeholder="Notes (optional)"
                            value={form.notes}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                            rows={2}
                            className="input-field resize-none"
                        />
                        <div className="flex gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary w-auto px-6"
                            >
                                {submitting ? 'Adding...' : 'Add application'}
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

            {/* Empty state */}
            {applications.length === 0 ? (
                <EmptyState
                    icon="💼"
                    title="No applications yet"
                    description="Start tracking your job applications to stay organized and never miss a follow-up."
                    action={
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary w-auto px-6"
                        >
                            Add your first application
                        </button>
                    }
                />
            ) : (

                /* Kanban Board */
                <div className="grid grid-cols-5 gap-4 overflow-x-auto">
                    {STATUSES.map(status => {
                        const statusApps = getAppsForStatus(status.key);
                        return (
                            <div key={status.key} className="min-w-[180px]">

                                {/* Column header */}
                                <div className={`flex items-center justify-between
                                 px-3 py-2 rounded-lg mb-3
                                 ${status.bg}`}>
                  <span className={`text-xs font-semibold
                                    ${status.color}`}>
                    {status.label}
                  </span>
                                    <span className={`text-xs font-bold
                                    ${status.color}`}>
                    {statusApps.length}
                  </span>
                                </div>

                                {/* Application cards */}
                                <div className="space-y-0">
                                    {statusApps.length === 0 ? (
                                        <div className="border border-dashed border-border
                                    rounded-xl p-4 text-center">
                                            <p className="text-[10px] text-text-muted">
                                                No applications
                                            </p>
                                        </div>
                                    ) : (
                                        statusApps.map(app => (
                                            <AppCard
                                                key={app.id}
                                                app={app}
                                                onClick={() => setSelectedApp(app)}
                                                onDelete={handleDelete}
                                            />
                                        ))
                                    )}
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail modal */}
            {selectedApp && (
                <AppDetailModal
                    app={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onUpdate={fetchAll}
                />
            )}

        </div>
    );
};

export default Jobs;