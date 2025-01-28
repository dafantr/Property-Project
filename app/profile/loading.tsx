import React from 'react';

const ProfileLoadingSkeleton = () => {
  return (
    <section className="animate-pulse">
      <h1 className="text-2xl font-semibold mb-8 capitalize bg-primary/10 w-40 h-8 rounded"></h1>
      <div className="border p-8 rounded-md">
        {/* Profile Image Loader */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full"></div>
          <div className="bg-primary/10 h-6 w-40 rounded"></div>
        </div>

        {/* Form Loader */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="bg-primary/10 h-4 w-20 mb-2 rounded"></div>
              <div className="bg-primary/10 h-10 w-full rounded"></div>
            </div>
          ))}
        </div>

        {/* Submit Button Loader */}
        <div className="mt-8">
          <div className="bg-primary/10 h-10 w-40 rounded"></div>
        </div>
      </div>
    </section>
  );
};

export default ProfileLoadingSkeleton;
