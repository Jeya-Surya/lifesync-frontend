const MetricCard = ({ label, value, sub, icon: Icon, color = 'text-primary-light' }) => {
    return (
        <div className="card">
            <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon size={15} className={`${color} flex-shrink-0`} />}
                <span className="text-xs text-text-secondary">{label}</span>
            </div>
            <p className={`text-2xl font-semibold text-text-primary`}>
                {value}
            </p>
            {sub && (
                <p className="text-xs text-text-muted mt-1">{sub}</p>
            )}
        </div>
    );
};

export default MetricCard;