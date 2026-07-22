import { useState } from 'react';
import { Bot, RefreshCw, Target, Flame,
    Briefcase, AlertTriangle, Sparkles } from 'lucide-react';
import { coachApi } from '../../api/coachApi';
import toast from 'react-hot-toast';

// ── Insight Card ──────────────────────────────────────────────
const InsightCard = ({ insight, index }) => {
    const icons = [Target, Flame, Briefcase, Sparkles];
    const Icon = icons[index % icons.length];

    return (
        <div className="flex items-start gap-3 py-3
                    border-b border-border last:border-0">
            <div className="w-7 h-7 rounded-lg bg-primary/20
                      flex items-center justify-center flex-shrink-0
                      mt-0.5">
                <Icon size={13} className="text-primary-light" />
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
                {insight}
            </p>
        </div>
    );
};

// ── Empty State ───────────────────────────────────────────────
const CoachEmptyState = ({ onGenerate, loading }) => (
    <div className="flex flex-col items-center justify-center
                  py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-primary/20
                    flex items-center justify-center mb-5">
            <Bot size={28} className="text-primary-light" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
            Your AI Coach is ready
        </h2>
        <p className="text-sm text-text-muted leading-relaxed mb-8">
            Get a personalized morning briefing based on your goals,
            habits, and job applications. Powered by Groq's
            llama-3.3-70b model.
        </p>
        <button
            onClick={onGenerate}
            disabled={loading}
            className="btn-primary w-auto px-8 flex items-center gap-2"
        >
            {loading
                ? <><RefreshCw size={15} className="animate-spin" />
                    Generating briefing...</>
                : <><Sparkles size={15} />
                    Get today's briefing</>
            }
        </button>
        <p className="text-xs text-text-muted mt-4">
            Takes about 5-10 seconds
        </p>
    </div>
);

// ── Loading State ─────────────────────────────────────────────
const CoachLoading = () => (
    <div className="max-w-2xl mx-auto">
        {/* Briefing card skeleton */}
        <div className="card bg-primary/10 border-primary/30 mb-6 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/30
                        animate-pulse" />
                <div className="space-y-2">
                    <div className="h-3 w-32 bg-primary/20 rounded
                          animate-pulse" />
                    <div className="h-2 w-24 bg-primary/10 rounded
                          animate-pulse" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 w-full bg-primary/10 rounded
                        animate-pulse" />
                <div className="h-3 w-4/5 bg-primary/10 rounded
                        animate-pulse" />
                <div className="h-3 w-3/5 bg-primary/10 rounded
                        animate-pulse" />
            </div>
        </div>
        <p className="text-center text-sm text-text-muted animate-pulse">
            🤖 AI is analyzing your goals, habits, and applications...
        </p>
    </div>
);

// ── Main Coach Page ───────────────────────────────────────────
const Coach = () => {
    const [briefing, setBriefing] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await coachApi.getBriefing();
            setBriefing(res.data);
            toast.success('Briefing generated!');
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                'Failed to generate briefing. Make sure all services are running.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-text-primary
                         flex items-center gap-2">
                        <Bot size={20} className="text-primary-light" />
                        AI Coach
                    </h1>
                    <p className="text-sm text-text-muted mt-0.5">
                        Powered by Groq · llama-3.3-70b-versatile
                    </p>
                </div>
                {briefing && (
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn-secondary w-auto flex items-center
                       gap-2 px-4"
                    >
                        <RefreshCw
                            size={14}
                            className={loading ? 'animate-spin' : ''}
                        />
                        Refresh
                    </button>
                )}
            </div>

            {/* Loading state */}
            {loading && <CoachLoading />}

            {/* Empty state — no briefing yet */}
            {!loading && !briefing && (
                <CoachEmptyState
                    onGenerate={handleGenerate}
                    loading={loading}
                />
            )}

            {/* Briefing content */}
            {!loading && briefing && (
                <div className="space-y-5">

                    {/* Main briefing card */}
                    <div className="card bg-primary/10 border-primary/30">

                        {/* Coach header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary
                              flex items-center justify-center
                              flex-shrink-0">
                                <Bot size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text-primary">
                                    LifeSync AI Coach
                                </p>
                                <p className="text-xs text-primary-light">
                                    {briefing.date
                                        ? new Date(briefing.date).toLocaleDateString(
                                            'en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            }
                                        )
                                        : new Date().toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                        })
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Greeting */}
                        {briefing.greeting && (
                            <p className="text-base font-medium text-text-primary
                            mb-3">
                                {briefing.greeting}
                            </p>
                        )}

                        {/* Summary */}
                        {briefing.overallSummary && (
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {briefing.overallSummary}
                            </p>
                        )}

                    </div>

                    {/* Insights */}
                    {briefing.insights && briefing.insights.length > 0 && (
                        <div className="card">
                            <h3 className="text-sm font-semibold text-text-primary
                             mb-1 flex items-center gap-2">
                                <Sparkles size={14} className="text-primary-light" />
                                Today's insights
                            </h3>
                            <p className="text-xs text-text-muted mb-3">
                                Based on your current goals, habits, and applications
                            </p>
                            <div>
                                {briefing.insights.map((insight, index) => (
                                    <InsightCard
                                        key={index}
                                        insight={insight}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Focus for today */}
                    {briefing.focusForToday && (
                        <div className="card border-warning/30 bg-warning/5">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-warning/20
                                flex items-center justify-center
                                flex-shrink-0 mt-0.5">
                                    <AlertTriangle size={14} className="text-warning" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-text-primary
                                mb-1">
                                        Focus for today
                                    </p>
                                    <p className="text-sm text-text-secondary
                                leading-relaxed">
                                        {briefing.focusForToday}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Regenerate button */}
                    <div className="text-center pt-2 pb-6">
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="btn-secondary w-auto px-6 flex items-center
                         gap-2 mx-auto"
                        >
                            <RefreshCw size={14} />
                            Generate new briefing
                        </button>
                        <p className="text-xs text-text-muted mt-2">
                            Briefing updates based on your latest data
                        </p>
                    </div>

                </div>
            )}

        </div>
    );
};

export default Coach;