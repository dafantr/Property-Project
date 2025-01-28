"use client";

const LoadingSkeleton = () => {
  const skeletonArray = Array.from({ length: 3 }); // Display 8 skeletons by default

  return (
    <div className="relative">
      <section className="mt-4 gap-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
        {skeletonArray.map((_, index) => (
          <div key={index} className="group relative animate-pulse">
            <div className="relative h-[300px] mb-2 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-12"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md mt-1 w-full"></div>
            <div className="flex justify-between items-center mt-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-8"></div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LoadingSkeleton;
