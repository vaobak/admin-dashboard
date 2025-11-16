export default function StatsCard({ title, value, icon: Icon, trend, variant = 'default' }) {
  const variants = {
    default: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
    primary: 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400',
    success: 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400',
    warning: 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400',
  };

  const isGradient = variant !== 'default';

  return (
    <div className={`
      ${variants[variant]}
      rounded-xl sm:rounded-2xl border shadow-sm hover:shadow-md p-4 sm:p-6 transition-all duration-200
      ${isGradient ? 'text-white' : ''}
    `}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`
          p-2 sm:p-3 rounded-lg sm:rounded-xl
          ${isGradient ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}
        `}>
          {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />}
        </div>
        {trend && (
          <span className={`
            text-xs font-semibold px-2 py-1 rounded-lg
            ${isGradient 
              ? 'bg-white/20' 
              : trend.startsWith('+') 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }
          `}>
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <p className={`text-xs sm:text-sm font-medium mb-1 ${isGradient ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
          {title}
        </p>
        <p className={`text-xl sm:text-2xl font-bold ${isGradient ? 'text-white' : 'text-gray-900 dark:text-white'} truncate`}>
          {value}
        </p>
      </div>
    </div>
  );
}
