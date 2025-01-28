import React from 'react';

const LoadingTable = () => {
  return (
    <div className="animate-pulse mt-16">
      {/* Table Header */}
      <div className="grid grid-cols-5 bg-primary/30 text-white rounded-lg p-2">
        <div className="h-6 w-20 bg-primary/10 rounded"></div>
        <div className="h-6 w-28 bg-primary/10 rounded"></div>
        <div className="h-6 w-28 bg-primary/10 rounded"></div>
        <div className="h-6 w-24 bg-primary/10 rounded"></div>
        <div className="h-6 w-20 bg-primary/10 rounded"></div>
      </div>

      {/* Table Body */}
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 border-b border-gray-200 p-4"
        >
          <div className="h-32 w-full bg-primary/10 rounded"></div>
          <div className="h-6 w-28 bg-primary/10 rounded"></div>
          <div className="h-6 w-32 bg-primary/10 rounded"></div>
          <div className="h-6 w-24 bg-primary/10 rounded"></div>
          <div className="flex gap-2">
            <div className="h-6 w-8 bg-primary/10 rounded"></div>
            <div className="h-6 w-8 bg-primary/10 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingTable;
