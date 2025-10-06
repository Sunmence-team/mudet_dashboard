import React, { useState } from "react";
import { CgArrowRight } from "react-icons/cg";
import AnnouncementModal from "../modals/AnnouncementModal";

const AnnouncementCard = ({ announcements = [] }) => {
  const defaultAnnouncements = [
    {
      title: "Update your account details",
      description:
        "This is to notify all users to update their bank details for smooth transfer",
      date: "10/10/2020",
      color: "#2B7830",
      action: "Update Now",
    },
    {
      title: "Update your account details",
      description:
        "This is to notify all users to update their bank details for smooth transfer",
      date: "10/09/2025",
      color: "#A9890B",
      action: "Update Now",
    },
    {
      title: "Update your account details",
      description:
        "This is to notify all users to update their bank details for smooth transfer",
      date: "10/09/2025",
      color: "#2B7830",
      action: "Update Now",
    },
  ];

  const itemsToRender =
    announcements.length > 0 ? announcements : defaultAnnouncements;

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  return (
    <>
      <div className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Announcement Board
        </h2>
        <div className="styled-scrollbar space-y-4 max-h-65 overflow-y-auto">
          {itemsToRender.map((item, index) => (
            <div
              key={index}
              className="lg:w-[97%] relative bg-white rounded-xl p-4 border border-gray-200 hover:bg-[#EFF7F0]/10 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="absolute left-0 z-[999] top-0 bottom-0 w-3 rounded-t-full rounded-b-full"
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
                  {hoveredIndex === index ? (
                    <div
                      className="text-sm text-black font-medium hover:text-blue-700 flex items-center hover:underline group"
                      onClick={() => setSelectedAnnouncement(item)}
                    >
                      View
                      <CgArrowRight className="rotate-[-45deg] text-base group-hover:underline" />
                    </div>
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

      {/* Modal only once */}
      {selectedAnnouncement && (
        <AnnouncementModal
          announcement={selectedAnnouncement}
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </>
  );
};

export default AnnouncementCard;
