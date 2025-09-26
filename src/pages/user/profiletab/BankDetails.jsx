import React from "react";

const BankDetails = () => {
  return (
    <form className="space-y-4 p-6">
      {/* Account Name */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Account Name
        </label>
        <input
          type="text"
          placeholder="Enter account name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
      </div>

      {/* Account Number */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Account Number
        </label>
        <input
          type="text"
          placeholder="Enter account number"
          maxLength={10}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
      </div>

      {/* Select Bank */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Select Bank
        </label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        >
          <option value="">Choose your bank</option>
          <option value="access">Access Bank</option>
          <option value="gtb">GTBank</option>
          <option value="zenith">Zenith Bank</option>
          <option value="uba">UBA</option>
          <option value="firstbank">First Bank</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border-1 text-white text-sm font-medium py-4 px-5 rounded-4xl w-full"
      >
        Save Bank Details
      </button>
    </form>
  );
};

export default BankDetails;
