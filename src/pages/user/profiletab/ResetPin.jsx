import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPin = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form className="space-y-4 p-6">
      {/* Current Pin */}
      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2">
          Current Pin
        </label>
        <input
          type={showCurrent ? "text" : "password"}
          maxLength={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
        <span
          onClick={() => setShowCurrent(!showCurrent)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showCurrent ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      {/* New Pin */}
      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2">
          New Pin
        </label>
        <input
          type={showNew ? "text" : "password"}
          maxLength={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
        <span
          onClick={() => setShowNew(!showNew)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      {/* Confirm New Pin */}
      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2">
          Confirm New Pin
        </label>
        <input
          type={showConfirm ? "text" : "password"}
          maxLength={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
        <span
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      <button
        type="submit"
        className="bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border text-white text-sm font-medium py-4 px-5 rounded-4xl w-full"
      >
        Reset Pin
      </button>
    </form>
  );
};

export default ResetPin;
