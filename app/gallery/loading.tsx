import React from 'react';

const GalleryLoadingTable = () => {
  return (
    <div className="animate-pulse mt-16">
      {/* Table Header */}
      <div className="grid grid-cols-3 bg-primary/30 text-white rounded-lg p-2 mb-4">
        <div className="h-6 w-20 bg-primary/10 rounded"></div>
        <div className="h-6 w-28 bg-primary/10 rounded"></div>
        <div className="h-6 w-24 bg-primary/10 rounded"></div>
      </div>

      {/* Table Rows */}
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-3 gap-4 border-b border-gray-200 p-4"
        >
          {/* Media Column */}
          <div className="h-32 w-full bg-primary/10 rounded"></div>
          {/* Title Column */}
          <div className="h-6 w-32 bg-primary/10 rounded"></div>
          {/* Actions Column */}
          <div className="flex gap-2">
            <div className="h-6 w-8 bg-primary/10 rounded"></div>
            <div className="h-6 w-8 bg-primary/10 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryLoadingTable;
