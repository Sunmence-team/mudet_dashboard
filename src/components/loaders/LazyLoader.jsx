import React from "react";

const LazyLoader = ({ color, width }) => {
  return (
    <div className="flex items-center justify-center py-4">
      <svg
        className={`animate-spin `}
        style={{
          color: color ? color : "gray",
          width: width ? width : "35px",
          height: width ? width : "35px",
        }}
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
    </div>
  );
};

export default LazyLoader;
