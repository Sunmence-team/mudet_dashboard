import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center w-full mx-auto">
      <div className="w-16 h-16 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
