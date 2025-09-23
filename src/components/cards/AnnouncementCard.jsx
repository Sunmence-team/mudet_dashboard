import React from "react";
import { BsArrowBarLeft } from "react-icons/bs";
import { Link } from "react-router-dom";
import { CgArrowRight } from "react-icons/cg";

const AnnouncementCard = ({ announcements = [] }) => {
  const defaultAnnouncements = [
    {
      title: "Update your account details",
      description:
        "This is to notify all users to update their bank details for smooth transfer",
      action: "View",
      date: null,
      color: "#2B7830", 
    },
    {
      title: "Update your account details",
      description:
        "This is to notify all users to update their bank details for smooth transfer",
      action: null,
      date: "10/09/2025",
      color: "#A9890B", 
    },
    {
      title: "Update your account details",
      description:
        "This is to notify all users to update their bank details for smooth transfer",
      action: null,
      date: "10/09/2025",
      color: "#2B7830", 
    },
  ];

  const itemsToRender =
    announcements.length > 0 ? announcements : defaultAnnouncements;

  return (
    <div className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Announcement Board
      </h2>
      <div
        className="space-y-4 max-h-70 overflow-y-auto"
        style={{ scrollbarWidth: "auto", scrollbarColor: "#cbd5e1 #f1f5f9" }}
      >
        {itemsToRender.map((item, index) => (
          <div
            key={index}
            className="relative bg-white rounded-xl p-4 border border-gray-200 overflow-hidden hover:bg-[#EFF7F0]/10 cursor-pointer"
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="flex justify-between items-start pl-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4 font-semibold">
                {item.action ? (
                  <Link
                    to="/user/announcement"
                    className="text-sm text-black font-medium hover:text-blue-700 flex items-center hover:underline group"
                  >
                    {item.action}
                    <CgArrowRight className="rotate-[-45deg] text-base group-hover:underline" />
                  </Link>
                ) : (
                  <span className="text-sm lg:text-base text-black">
                    {item.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementCard;
