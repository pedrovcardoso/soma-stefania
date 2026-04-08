'use client';

import React from 'react';

const CustomTooltip = ({ children, content, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-surface',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-surface',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-surface',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-surface',
  };

  if (!content) return <>{children}</>;

  return (
    <div className="relative group flex items-center shrink-0">
      {children}
      <div className={`absolute ${positionClasses[position]} px-2 py-1 text-[10px] font-semibold rounded-lg shadow-lg whitespace-nowrap z-[200] pointer-events-none transition-all duration-150 bg-surface text-text border border-border opacity-0 translate-y-1 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100`}>
        {content}
        <div className={`absolute border-4 ${arrowClasses[position]}`} />
      </div>
    </div>
  );
};

export default CustomTooltip;
