import React, { useState } from "react";
import { X } from "lucide-react";

const AnnouncementModal = ({ announcement, onClose }) => {
  const [isattachement, setIsAttachement] = useState(false);
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  console.log(announcement);

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <div
          className="w-10 h-1 rounded-full mb-4"
          style={{ backgroundColor: announcement.color }}
        ></div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {announcement.title}
        </h2>

        {isattachement ? (
          <>
            <img
              src={`${imageBaseUrl}/${announcement.image}`}
              alt={announcement.title}
              className="border border-gray-300 rounded-lg"
            />
          </>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-4">{announcement.date}</p>

            <p className="text-sm text-gray-700 leading-relaxed">
              {announcement.description}
            </p>
            {announcement.image && announcement.action && (
              <button
                className="mt-6 w-full bg-primary cursor-pointer text-white py-2 px-4 rounded-lg "
                onClick={() => setIsAttachement(!isattachement)}
              >
                {announcement.action}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnnouncementModal;
