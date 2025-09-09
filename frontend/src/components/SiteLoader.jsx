import React from 'react';

const SiteLoader = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  text = 'Loading...',
  showText = true,
  overlay = true,
  spinnerType = 'circle' // 'circle', 'dots', or 'bars'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const colorClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  const containerClasses = fullScreen
    ? `fixed inset-0 flex items-center justify-center z-50 ${overlay ? 'bg-white bg-opacity-90' : ''}`
    : 'flex items-center justify-center p-4';

  const renderSpinner = () => {
    switch (spinnerType) {
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full animate-bounce ${colorClasses[color]}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-6 animate-pulse ${colorClasses[color]}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      default: // circle
        return (
          <div
            className={`
              animate-spin rounded-full border-4 border-t-transparent
              ${sizeClasses[size]}
              border-${color.split('-')[0]}-500
            `}
          />
        );
    }
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        {renderSpinner()}
        
        {showText && (
          <p className="text-gray-600 font-medium text-sm">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default SiteLoader;