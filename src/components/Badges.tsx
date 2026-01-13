interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  className?: string;
}

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  const colors = {
    critical: 'bg-red-50 text-red-700 border-red-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    low: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${colors[severity]} ${className}`}
    >
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'success' | 'partial' | 'failed' | 'running';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const colors = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    partial: 'bg-amber-50 text-amber-700 border-amber-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
    running: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const labels = {
    success: 'Success',
    partial: 'Partial',
    failed: 'Failed',
    running: 'Running',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${colors[status]} ${className}`}
    >
      {labels[status]}
    </span>
  );
}

interface ChipProps {
  label: string;
  onClick?: () => void;
  onRemove?: () => void;
  active?: boolean;
  className?: string;
}

export function Chip({ label, onClick, onRemove, active, className = '' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
        active
          ? 'bg-emerald-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 hover:text-gray-900"
        >
          ×
        </button>
      )}
    </span>
  );
}

interface RiskScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RiskScoreBadge({ score, size = 'md', className = '' }: RiskScoreBadgeProps) {
  const getColor = () => {
    if (score >= 81) return 'bg-red-50 text-red-700 border-red-200';
    if (score >= 61) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (score >= 31) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg font-bold border ${getColor()} ${sizeClasses[size]} ${className}`}
    >
      {score}
    </span>
  );
}


