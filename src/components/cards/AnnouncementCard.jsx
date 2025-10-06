import React, { useState, useEffect } from "react";
import { CgArrowRight } from "react-icons/cg";
import AnnouncementModal from "../modals/AnnouncementModal";
import api from "../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

const AnnouncementCard = () => {
  const { token } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate random color for each announcement
  const getRandomColor = () => {
    const colors = ["#2B7830", "#A9890B", "#1E90FF", "#FF4500", "#8A2BE2"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          console.log("No token provided");
          setLoading(false);
          return;
        }
        console.log(
          `Fetching announcements from: /api/announcements with token: ${token}`
        );
        const response = await api.get("/api/announcements", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(
          "Fetched announcements response:",
          JSON.stringify(response.data, null, 2)
        );
        const announcementsData = response.data.data.data || [];
        console.log(
          "Raw announcement data array:",
          JSON.stringify(announcementsData, null, 2)
        );
        const mappedAnnouncements = announcementsData.map((item, index) => {
          console.log(
            `Announcement ${index + 1} start_date:`,
            item.start_date || "Not found"
          );
          return {
            id: item.id,
            title: item.title,
            description: item.message,
            date: item.start_date,
            color: getRandomColor(),
            action: "View",
          };
        });
        console.log(
          "Mapped announcements:",
          JSON.stringify(mappedAnnouncements, null, 2)
        );
        setAnnouncements(mappedAnnouncements);
        console.log(
          "Set announcements state:",
          JSON.stringify(mappedAnnouncements, null, 2)
        );
      } catch (error) {
        console.error("Error fetching announcements:", error);
        if (error.response) {
          console.log(
            "Error response:",
            JSON.stringify(error.response.data, null, 2)
          );
          console.log("Error status:", error.response.status);
          console.log(
            "Error headers:",
            JSON.stringify(error.response.headers, null, 2)
          );
          toast.error(
            error.response.data?.message || "Failed to fetch announcements."
          );
        } else if (error.request) {
          console.log("Error request:", error.request);
          console.log("CORS or network error details:", error.message);
          toast.error("CORS or network error: Unable to fetch announcements.");
        } else {
          console.log("Error message:", error.message);
          toast.error("Failed to fetch announcements: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [token]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const scrollContainers = document.querySelectorAll(
      'body, html, [class*="overflow-y-auto"], [class*="overflow-scroll"]'
    );

    if (selectedAnnouncement) {
      scrollContainers.forEach((el) => (el.style.overflow = "hidden"));
    } else {
      scrollContainers.forEach((el) => (el.style.overflow = ""));
    }

    return () => {
      scrollContainers.forEach((el) => (el.style.overflow = ""));
    };
  }, [selectedAnnouncement]);

  const handleView = async (id) => {
    try {
      console.log(`Fetching announcement: /api/announcements/${id}`);
      const response = await api.get(`/api/announcements/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(
        "View announcement response:",
        JSON.stringify(response.data, null, 2)
      );
      const announcement = response.data.data;
      console.log(
        "View announcement start_date:",
        announcement.start_date || "Not found"
      );
      const mappedAnnouncement = {
        id: announcement.id,
        title: announcement.title,
        description: announcement.message,
        date: announcement.start_date,
        color: getRandomColor(),
        action: "View",
        // image: announcement.image ? `https://mudetrealsolution.com/api/public/storage/${announcement.image}` : null,
        end_date: announcement.end_date,
        created_at: announcement.created_at,
        updated_at: announcement.updated_at,
      };
      console.log(
        "Set selected announcement:",
        JSON.stringify(mappedAnnouncement, null, 2)
      );
      setSelectedAnnouncement(mappedAnnouncement);
    } catch (error) {
      console.error("Error viewing announcement:", error);
      if (error.response) {
        console.log(
          "Error response:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.log("Error status:", error.response.status);
        console.log(
          "Error headers:",
          JSON.stringify(error.response.headers, null, 2)
        );
        toast.error(
          error.response.data?.message || "Failed to view announcement."
        );
      } else if (error.request) {
        console.log("Error request:", error.request);
        console.log("CORS or network error details:", error.message);
        toast.error("CORS or network error: Unable to view announcement.");
      } else {
        console.log("Error message:", error.message);
        toast.error("Failed to view announcement: " + error.message);
      }
    }
  };

  return (
    <>
      <div className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Announcement Board
        </h2>
        <div className="styled-scrollbar space-y-4 max-h-65 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-gray-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </div>
          ) : announcements.length > 0 ? (
            announcements.map((item, index) => (
              <div
                key={index}
                className="lg:w-[97%] relative bg-white rounded-xl p-4 border border-gray-200 hover:bg-[#000000]/10 cursor-pointer"
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
                        className="text-sm text-black font-medium hover:text-primary/90 flex items-center hover:underline group"
                        onClick={() => handleView(item.id)}
                      >
                        View
                        <CgArrowRight className="rotate-[-45deg] text-base group-hover:underline" />
                      </div>
                    ) : (
                      <span className="text-sm lg:text-base text-black">
                        {item.date || "N/A"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-4">
              No announcements available
            </p>
          )}
        </div>
      </div>

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
