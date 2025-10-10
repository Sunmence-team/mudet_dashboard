import React, { useState, useEffect } from "react";
import { CgArrowRight } from "react-icons/cg";
import AnnouncementModal from "../modals/AnnouncementModal";
import api from "../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import LazyLoader from "../LazyLoader";
import PaginationControls from "../../utilities/PaginationControls";

const AnnouncementCard = ({ style, refresh, pagination=false }) => {
  const { token } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        console.log("No token provided");
        setLoading(false);
        return;
      }

      const response = await api.get("/api/announcements", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {page: currentPage, }
      });
      console.log("response:", response);
      if (response.status === 200) {
        const { data, current_page, last_page } = response.data.data
        const announcementsData = data || [];
        const mappedAnnouncements = announcementsData.map((item) => {
          return {
            id: item.id,
            title: item.title,
            description: item.message,
            date: item.start_date,
            image: item.image,
            action: "View Attachement",
          };
        });
        setAnnouncements(mappedAnnouncements);
        setCurrentPage(current_page);
        setLastPage(last_page);
      }
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

  useEffect(() => {
    fetchAnnouncements();
  }, [refresh, token, currentPage]);

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-5 mx-auto border-gray-300 border h-89">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Announcement Board
        </h2>
        <div className={`styled-scrollbar space-y-4 max-h-65 ${style} overflow-y-auto`}>
          {loading ? (
            <LazyLoader />
          ) : announcements.length > 0 ? (
            announcements.map((item, index) => (
              <div
                key={index}
                className="lg:w-[97%] relative bg-white rounded-xl p-4 border border-gray-200 hover:bg-[#EFF7F0] cursor-pointer"
                onMouseOver={() => setSelectedAnnouncement(item)}
                onClick={() => setIsModalOpen(true)}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-3 rounded-t-full rounded-b-full"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#2B7830" : "#A9890B",
                  }}
                ></div>
                <div className="flex justify-between items-start pl-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.description?.slice(0, 300)}...
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4 font-semibold">
                    {selectedAnnouncement.id === item.id ? (
                      <div className="text-sm text-black font-medium hover:text-primary/90 flex items-center hover:underline group">
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
        <div className="mt-4">
          {
            pagination && (
              <PaginationControls 
                currentPage={currentPage}
                totalPages={lastPage}
                setCurrentPage={setCurrentPage}
              />
            )
          }
        </div>
      </div>

      {isModalOpen && (
        <AnnouncementModal
          announcement={selectedAnnouncement}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default AnnouncementCard;
