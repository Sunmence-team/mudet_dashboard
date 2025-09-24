import React from "react";

const PersonalDetails = () => {
  return (
    <form className="space-y-4 p-6">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Date of Birth
        </label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Gender
        </label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border-1 text-white text-sm font-medium py-4 px-5 rounded-2xl w-full"
      >
        Save Details
      </button>
    </form>
  );
};

export default PersonalDetails;
