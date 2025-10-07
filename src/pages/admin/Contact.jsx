import React, { useEffect, useState } from "react";
import { FaEye, FaTrash, FaSpinner } from "react-icons/fa";
import api from "../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

const Contact = () => {
  const { token } = useUser();
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingView, setLoadingView] = useState(null);
  const [viewData, setViewData] = useState(null); // ✅ Controls popup
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState([]);

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
      const response = await api.get(`/api/contact/all?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data.data || []);
      setPaginationLinks(response.data.links || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error(error.response?.data?.message || "Failed to fetch contacts.");
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleView = async (id) => {
    setLoadingView(id);
    try {
      const response = await api.get(`/api/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Handle response shape dynamically
      const contactDetails = response.data.data || response.data;
      if (contactDetails) {
        setViewData(contactDetails); // ✅ Show popup
      } else {
        toast.error("No contact details found.");
      }
    } catch (error) {
      console.error("Error viewing contact:", error);
      toast.error(error.response?.data?.message || "Failed to view contact.");
    } finally {
      setLoadingView(null);
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

  const handlePageChange = (pageUrl) => {
    if (!pageUrl) return;
    const page = new URL(pageUrl).searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page));
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div className="w-full">
        <div className="bg-white border border-black/10 rounded-lg p-4 md:p-8">
          <h3 className="text-xl font-semibold mb-4">All Contacts</h3>

          {loadingContacts ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : contacts.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-6 text-sm font-medium text-gray-900">
                          {`${contact.first_name || ""} ${contact.last_name || ""}`.trim() || "N/A"}
                        </td>
                        <td className="px-6 py-6 text-sm text-gray-500">{contact.phone || "N/A"}</td>
                        <td className="px-6 py-6 text-sm text-gray-500">{contact.email || "N/A"}</td>
                        <td className="px-6 py-6 text-sm text-gray-900 max-w-xs truncate">
                          {contact.message || "N/A"}
                        </td>
                        <td className="px-6 py-6 text-sm font-medium">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleView(contact.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                              disabled={loadingView === contact.id}
                            >
                              {loadingView === contact.id ? (
                                <FaSpinner className="animate-spin h-4 w-4" />
                              ) : (
                                <FaEye size={16} className="text-primary" />
                              )}
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
      </div>

      {/* ✅ View Popup */}
      {viewData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center text-primary">
              Contact Details
            </h3>
            <div className="flex flex-col gap-3 text-sm text-gray-700">
              <p><strong>ID:</strong> {viewData.id || "N/A"}</p>
              <p><strong>First Name:</strong> {viewData.first_name || "N/A"}</p>
              <p><strong>Last Name:</strong> {viewData.last_name || "N/A"}</p>
              <p><strong>Phone:</strong> {viewData.phone || "N/A"}</p>
              <p><strong>Email:</strong> {viewData.email || "N/A"}</p>
              <p><strong>Message:</strong> {viewData.message || "N/A"}</p>
              <p><strong>Created At:</strong> {viewData.created_at ? new Date(viewData.created_at).toLocaleString() : "N/A"}</p>
              <p><strong>Updated At:</strong> {viewData.updated_at ? new Date(viewData.updated_at).toLocaleString() : "N/A"}</p>
            </div>
            <button
              onClick={() => setViewData(null)}
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
