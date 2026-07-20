const EmptyState = ({ icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center
                    py-20 text-center">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-base font-medium text-text-primary mb-2">
                {title}
            </h3>
            <p className="text-sm text-text-muted mb-6 max-w-xs">
                {description}
            </p>
            {action && action}
        </div>
    );
};

export default EmptyState;