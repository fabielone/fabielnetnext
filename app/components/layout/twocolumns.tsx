import React, { ReactNode } from 'react';

interface  TwoColumnProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

const TwoColumn: React.FC<TwoColumnProps> = ({ leftContent, rightContent }) => {
  return (
    <div className="mx-auto p-4 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">{leftContent}</div>
        <div className="col-span-1">{rightContent}</div>
      </div>
     
    </div>
  );
};

export default TwoColumn;
