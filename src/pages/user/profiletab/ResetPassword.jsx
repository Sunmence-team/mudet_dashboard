import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form className="space-y-4 p-6">
      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2">
          Current Password
        </label>
        <input
          type={showCurrent ? "text" : "password"}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
        <span
          onClick={() => setShowCurrent(!showCurrent)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showCurrent ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2">
          New Password
        </label>
        <input
          type={showNew ? "text" : "password"}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          Must be at least 8 characters and different from current password
        </p>
        <span
          onClick={() => setShowNew(!showNew)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2">
          Confirm New Password
        </label>
        <input
          type={showConfirm ? "text" : "password"}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
        <span
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      <button className="bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border text-white text-sm font-medium py-4 px-5 rounded-4xl w-full">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
