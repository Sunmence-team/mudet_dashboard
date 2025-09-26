import React from "react";

const ContactDetails = () => {
  return (
    <form className="space-y-4 p-6">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="Enter your phone number"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Address
        </label>
        <textarea
          placeholder="Enter your address"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
        />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border-1 text-white text-sm font-medium py-4 px-5 rounded-4xl w-full"
      >
        Save Contact Details
      </button>
    </form>
  );
};

export default ContactDetails;
