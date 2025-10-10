import React, { useEffect, useState } from "react";
import { FaEye, FaTrash, FaSpinner } from "react-icons/fa";
import api from "../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import LazyLoader from "../../components/loaders/LazyLoader";
import { formatISODateToCustom } from "../../utilities/formatterutility";

const Contact = () => {
  const { token } = useUser();
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [selectedContact, setSelectedContact] = useState(null); // ✅ Controls popup

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchContacts(currentPage);
  }, [currentPage]);

  const fetchContacts = async (page = 1) => {
    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }
      const response = await api.get(`/api/contact/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          perPage: perPage,
        },
      });

      if (response.status === 200) {
        setContacts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error(error.response?.data?.message || "Failed to fetch contacts.");
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      const response = await api.delete(`/api/contact/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        toast.success(response.data.message || "Contact deleted successfully.");
        fetchContacts(currentPage);
      } else {
        toast.error(response.data.message || "Failed to delete contact.");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error(error.response?.data?.message || "Failed to delete contact.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div className="w-full">
        <h3 className="text-xl font-semibold mb-4">All Contacts</h3>

        {loadingContacts ? (
          <div className="flex items-center justify-center py-8">
            <LazyLoader color={"#2b7830"} size={32} />
          </div>
        ) : contacts.length > 0 ? (
          <>
            <div className="overflow-x-auto styled-scrollbar">
              <table className="min-w-full">
                <thead>
                  <tr className="font-semibold">
                    <th className="py-4 ps-2 text-start text-xs text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="py-4 px-4 text-center text-xs text-gray-500 uppercase">
                      Phone
                    </th>
                    <th className="py-4 px-4 text-center text-xs text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="py-4 px-4 text-center text-xs text-gray-500 uppercase">
                      Message
                    </th>
                    <th className="py-4 pe-2 text-end text-xs text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="sapce-y-4">
                  {contacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      className="bg-white text-sm text-center"
                    >
                      <td className="p-3 text-start rounded-s-xl border-y border-s-1 border-black/10 capitalize">
                        {`${contact.first_name || ""} ${contact.last_name || ""}`.trim() || "N/A"}
                      </td>
                      <td className="p-4 border-y border-black/10">{contact.phone || "N/A"}</td>
                      <td className="p-4 border-y border-black/10">{contact.email || "N/A"}</td>
                      <td className="p-4 border-y border-black/10">
                        <p className="line-clamp-1 max-w-xs mx-auto text-center">{contact.message || "N/A"}</p>
                      </td>
                      <td className="p-3 text-start rounded-e-xl border-y border-e-1 border-black/10">
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <FaEye size={16} className="text-primary" />
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash size={16} className="text-primary" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center space-x-2">
              {paginationLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(link.url)}
                  disabled={!link.url || link.active}
                  className={`px-4 py-2 rounded-full text-sm ${
                    link.active
                      ? "bg-primary text-white cursor-default"
                      : link.url
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 py-8">No contacts available</p>
        )}
      </div>

      {/* ✅ View Popup */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4 shadow-xl">
            <div className="w-full max-h-[400px] overflow-y-scroll styled-scrollbar">
              <h3 className="text-xl font-semibold mb-4 text-center text-primary">
                Contact Details
              </h3>
              <div className="flex flex-col gap-3 text-sm text-gray-700">
                <p><strong>First Name:</strong> {selectedContact.first_name || "N/A"}</p>
                <p><strong>Last Name:</strong> {selectedContact.last_name || "N/A"}</p>
                <p><strong>Phone:</strong> {selectedContact.phone || "N/A"}</p>
                <p><strong>Email:</strong> {selectedContact.email || "N/A"}</p>
                <p><strong>Message:</strong> {selectedContact.message || "N/A"}</p>
                <p><strong>Date:</strong> {formatISODateToCustom(selectedContact.created_at) || "N/A"}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="mt-6 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
