import React from "react";
import { FiEye } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";

const users = [
  {
    id: "001",
    name: "Dorcas Odekunle",
    earning: "₦0",
    email: "Dorcas@gmail.com",
    username: "Dorcas",
    phone: "08101213343",
    stockist: "Enable",
    status: "Active",
    joined: "17/09/25 12:22:36am",
  },
  {
    id: "002",
    name: "Dorcas Odekunle",
    earning: "₦0",
    email: "Dorcas@gmail.com",
    username: "Dorcas",
    phone: "08101213343",
    stockist: "Enable",
    status: "Active",
    joined: "17/09/25 12:22:36am",
  },
];

const AllUsers = () => {
  return (
    <div className="bg-[var(--color-tetiary)] min-h-screen p-4">
      {/* Search bar */}
      <div className="flex justify-end mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search users by user name or email"
            className="pl-4 pr-14 py-2 w-full rounded-[10px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <IoMdSearch
            size={22}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/30 cursor-pointer"
          />
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto lg:overflow-x-visible">
        {/* Headers */}
        <div className="grid grid-cols-10 gap-4 py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] text-sm md:text-base min-w-max lg:min-w-0">
          <span className="text-center">S/N</span>
          <span className="text-center">NAME</span>
          <span className="text-center">EARNING</span>
          <span className="text-center">EMAIL</span>
          <span className="text-center">USERNAME</span>
          <span className="text-center">PHONE</span>
          <span className="text-center">STOCKIST ENABLED</span>
          <span className="text-center">ACCOUNT STATUS</span>
          <span className="text-center">DATE JOINED</span>
          <span className="text-center">ACTION</span>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {users.map((user, idx) => (
            <div
              key={idx}
              className="grid grid-cols-10 gap-4 items-center py-3 bg-white rounded-md shadow-sm text-center text-black/80 text-sm md:text-[16px] font-medium min-w-max lg:min-w-0"
            >
              <span>{user.id}</span>
              <span>{user.name}</span>
              <span>{user.earning}</span>
              <span>{user.email}</span>
              <span>{user.username}</span>
              <span>{user.phone}</span>
              <button className="bg-[var(--color-primary)] text-white px-2 py-3 rounded-full text-xs">
                {user.stockist}
              </button>
              <span className="bg-[var(--color-tetiary)] text-[var(--color-primary)] px-2 py-3 rounded-full text-xs font-medium border border-[var(--color-primary)]/20">
                {user.status}
              </span>

              <span className="text-[var(--color-primary)] font-bold">
                {user.joined}
              </span>
              <span className="text-[var(--color-primary)] cursor-pointer flex justify-center">
                <FiEye size={18} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
