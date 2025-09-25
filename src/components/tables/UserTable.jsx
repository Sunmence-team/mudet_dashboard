import React, { useState } from "react";
import { Eye } from "lucide-react";

const UserTable = () => {
  const defaultUsers = [
    {
      sn: "001",
      name: "Dorcas Odelunle",
      earning: 100,
      email: "dorcas1@gmail.com",
      username: "Dorcas",
      phone: "08101213343",
      stockistEnabled: false,
      accountStatus: "Active",
      dateJoined: "17/09/25 12:23:46am",
    },
    {
      sn: "002",
      name: "Dorcas Odelunle",
      earning: 400,
      email: "dorcas1@gmail.com",
      username: "Dorcas",
      phone: "08101213343",
      stockistEnabled: true,
      accountStatus: "Active",
      dateJoined: "17/09/25 12:23:46am",
    },
    {
      sn: "003",
      name: "Dorcas Odelunle",
      earning: 493828,
      email: "dorcas1@gmail.com",
      username: "Dorcas",
      phone: "08101213343",
      stockistEnabled: false,
      accountStatus: "Active",
      dateJoined: "17/09/25 12:23:46am",
    },
    {
      sn: "004",
      name: "Dorcas Odelunle",
      earning: 20000,
      email: "dorcas1@gmail.com",
      username: "Dorcas",
      phone: "08101213343",
      stockistEnabled: false,
      accountStatus: "Active",
      dateJoined: "17/09/25 12:23:46am",
    },
    {
      sn: "005",
      name: "Dorcas Odelunle",
      earning: 10000,
      email: "dorcas1@gmail.com",
      username: "Dorcas",
      phone: "08101213343",
      stockistEnabled: true,
      accountStatus: "Inactive",
      dateJoined: "17/09/25 12:23:46am",
    },
    {
      sn: "006",
      name: "Dorcas Odelunle",
      earning: 1000,
      email: "dorcas1@gmail.com",
      username: "Dorcas",
      phone: "08101213343",
      stockistEnabled: true,
      accountStatus: "Inactive",
      dateJoined: "17/09/25 12:23:46am",
    },
  ];
  const [users,setUsers] = useState(defaultUsers);

  const handleToggleDetails = (user)=>{
    // user = {..., earning:"****"}
  }

  return (
    <table className="w-full text-sm text-left border-collapse">
      <thead className="text-gray-700 font-semibold text-xs">
        <tr>
          <th className="py-3 px-4">S/N</th>
          <th className="py-3 px-4">Name</th>
          <th className="py-3 px-4">Earning</th>
          <th className="py-3 px-4">Email</th>
          <th className="py-3 px-4">Username</th>
          <th className="py-3 px-4">Phone</th>
          <th className="py-3 px-4">Stockist Enabled</th>
          <th className="py-3 px-4">Account Status</th>
          <th className="py-3 px-4">Date Joined</th>
          <th className="py-3 px-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index} className="bg-white">
            <td className="lg:py-5 py-3 px-4">{user.sn}</td>
            <td className="lg:py-5 py-3 px-4">{user.name}</td>
            <td className="lg:py-5 py-3 px-4">
              ₦{user.earning.toLocaleString()}
            </td>
            <td className="lg:py-5 py-3 px-4">{user.email}</td>
            <td className="lg:py-5 py-3 px-4">{user.username}</td>
            <td className="lg:py-5 py-3 px-4">{user.phone}</td>
            <td className="lg:py-5 py-3 px-4">
              {user.stockistEnabled ? (
                <span className="bg-primary/10 text-primary py-1 px-3 rounded-full text-xs">
                  Enabled
                </span>
              ) : (
                <button className="bg-primary text-white py-1 px-3 rounded-full text-xs">
                  Enable
                </button>
              )}
            </td>
            <td className="py-2 px-4">
              <span
                className={`${
                  user.accountStatus === "Active"
                    ? "bg-primary/10"
                    : "bg-red-700 text-white"
                } text-primary py-1 px-3 rounded-full text-xs`}
              >
                {user.accountStatus}
              </span>
            </td>
            <td className="py-2 px-4">{user.dateJoined}</td>
            <td className="py-2 px-4 text-primary">
              <Eye className="cursor-pointer" size={18} onClick={handleToggleDetails}/>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
