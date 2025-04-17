import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-emerald-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-emerald-500" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            />
          </svg>
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Loading...
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we fetch the data
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
