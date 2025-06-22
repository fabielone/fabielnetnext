import React, { ReactNode } from 'react';

interface TwoColumnProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

const TwoColumn: React.FC<TwoColumnProps> = ({ leftContent, rightContent }) => {
  return (
    <div className="mx-auto p-2 md:p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div className="col-span-1">{leftContent}</div>
        <div className="col-span-1">{rightContent}</div>
      </div>        
    </div>
  );
};

export default TwoColumn;