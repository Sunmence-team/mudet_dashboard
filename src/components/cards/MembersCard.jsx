import React from "react";

const MembersCard = () => {
  const members = [
    {
      name: "Dorcas Odekunle",
      username: "@dorcasodekunle",
      date: "10/09/2025",
    },
    {
      name: "Dorcas Odekunle",
      username: "@dorcasodekunle",
      date: "10/09/2025",
    },
    {
      name: "Dorcas Odekunle",
      username: "@dorcasodekunle",
      date: "10/09/2025",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-5 mx-auto border-gray-300 border">
      <h2 className="text-2xl font-semibold mb-6">New Members</h2>
      <div
        className="space-y-4 max-h-70 overflow-y-auto"
        style={{ scrollbarWidth: "auto", scrollbarColor: "#cbd5e1 #f1f5f9" }}
      >
        {members.map((member, index) => (
          <div
            key={index}
            className="flex justify-between items-start bg-white rounded-xl p-4 border border-gray-300"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/30 text-primary font-bold">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-semibold text-black">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.username}</p>
              </div>
            </div>
            <span className="lg:text-base font-semibold text-sm text-black">
              {member.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersCard;
