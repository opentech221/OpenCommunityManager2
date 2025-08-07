import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'purple' | 'green' | 'yellow' | 'red' | 'blue';
  onClick?: () => void;
  isActive?: boolean;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  onClick,
  isActive = false,
  subtitle
}) => {
  const colorClasses = {
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      icon: 'text-purple-600',
      hover: 'hover:bg-purple-200',
      ring: 'ring-purple-500'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: 'text-green-600',
      hover: 'hover:bg-green-200',
      ring: 'ring-green-500'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      icon: 'text-yellow-600',
      hover: 'hover:bg-yellow-200',
      ring: 'ring-yellow-500'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: 'text-red-600',
      hover: 'hover:bg-red-200',
      ring: 'ring-red-500'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: 'text-blue-600',
      hover: 'hover:bg-blue-200',
      ring: 'ring-blue-500'
    }
  };

  const classes = colorClasses[color];

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        ${classes.bg} rounded-lg p-3 shadow border transition-all duration-200
        ${onClick ? `${classes.hover} cursor-pointer` : 'cursor-default'}
        ${isActive ? `ring-2 ${classes.ring} ring-offset-2 transform scale-105` : ''}
        group w-full
      `}
      title={onClick ? `Filtrer par ${title.toLowerCase()}` : undefined}
    >
      <div className="flex flex-col items-center space-y-2">
        <Icon className={`h-6 w-6 ${classes.icon} transition-transform group-hover:scale-110`} />
        <div className={`text-lg sm:text-xl font-bold ${classes.text}`}>
          {value}
        </div>
        <div className={`text-xs ${classes.text} font-medium text-center leading-tight`}>
          {title}
        </div>
        {subtitle && (
          <div className={`text-xs ${classes.text} opacity-75 text-center`}>
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );
};

export default StatCard;
