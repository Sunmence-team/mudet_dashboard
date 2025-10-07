import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { FaEye, FaEdit, FaTrash, FaSpinner, FaImage } from "react-icons/fa";
import * as Yup from "yup";
import api from "../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

const Announcements = () => {
    const { token } = useUser();
    const [announcements, setAnnouncements] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingView, setLoadingView] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [paginationLinks, setPaginationLinks] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAnnouncements(currentPage);
    }, [currentPage]);

    const fetchAnnouncements = async (page = 1) => {
        try {
            if (!token) {
                toast.error("No authentication token found. Please log in.");
                console.log("No token provided");
                return;
            }
            console.log(`Fetching announcements from: /api/announcements?page=${page} with token: ${token}`);
            const response = await api.get(`/api/announcements?page=${page}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched announcements response:", JSON.stringify(response.data, null, 2));
            const announcementsData = response.data.data.data || [];
            console.log("Parsed announcements data:", JSON.stringify(announcementsData, null, 2));
            setAnnouncements(announcementsData);
            console.log("Set announcements state:", JSON.stringify(announcementsData, null, 2));
            setCurrentPage(response.data.data.current_page || 1);
            setLastPage(response.data.data.last_page || 1);
            setPaginationLinks(response.data.data.links || []);
            console.log("Pagination info:", {
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                links: response.data.data.links,
            });
        } catch (error) {
            console.error("Error fetching announcements:", error);
            console.log("Error details:", JSON.stringify(error.response?.data, null, 2));
            toast.error(error.response?.data?.message || "Failed to fetch announcements.");
        } finally {
            setLoadingAnnouncements(false);
        }
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required").min(2, "Title must be at least 2 characters"),
        message: Yup.string().required("Message is required"),
        start_date: Yup.date().required("Start date is required"),
        end_date: Yup.date()
            .required("End date is required")
            .min(Yup.ref("start_date"), "End date must be after start date"),
        image: Yup.mixed()
            .required("Image is required")
            .test("fileType", "Image must be a JPEG, PNG, or JPG file", (value) => {
                if (!value) return false;
                return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
            }),
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            message: "",
            start_date: "",
            end_date: "",
            image: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoadingSubmit(true);
            try {
                if (!token) {
                    toast.error("No authentication token found. Please log in.");
                    console.log("No token provided for form submission");
                    return;
                }

                const payload = new FormData();
                payload.append("title", values.title);
                payload.append("message", values.message);
                payload.append("start_date", values.start_date);
                payload.append("end_date", values.end_date);
                payload.append("image", values.image);

                console.log("Submitting announcement with payload:");
                for (let [key, value] of payload.entries()) {
                    console.log(`${key}: ${value instanceof File ? value.name : value}`);
                }

                const url = isEditing ? `/api/announcements/${editingId}` : "/api/announcements/create";
                console.log(`Submitting to: ${url}`);
                const response = await api.post(url, payload, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });


                console.log("Announcement response:", JSON.stringify(response.data, null, 2));
                if (response.data.status === "success") {
                    toast.success(response.data.message || "Announcement created/updated successfully");
                    if (isEditing) {
                        setEditingId(null);
                        setIsEditing(false);
                        formik.resetForm();
                    }
                    fetchAnnouncements(currentPage);
                } else {
                    toast.error(response.data.message || "Failed to create/update announcement.");
                }
            } catch (error) {
                console.error("Error submitting announcement:", error);
                console.log("Error details:", JSON.stringify(error.response?.data, null, 2));
                const errorMessage = error.response?.data?.errors?.image
                    ? error.response.data.errors.image.join(", ")
                    : error.response?.data?.message || error.message || "Failed to create/update announcement.";
                toast.error(errorMessage);
            } finally {
                setLoadingSubmit(false);
            }
        },
    });

    const handleView = async (id) => {
        setLoadingView(id);
        try {
            console.log(`Fetching announcement: /api/announcements/${id}`);
            const response = await api.get(`/api/announcements/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("View announcement response:", JSON.stringify(response.data, null, 2));
            setViewData(response.data.data);
            console.log("Set viewData:", JSON.stringify(response.data.data, null, 2));
        } catch (error) {
            console.error("Error viewing announcement:", error);
            console.log("Error details:", JSON.stringify(error.response?.data, null, 2));
            toast.error(error.response?.data?.message || "Failed to view announcement.");
        } finally {
            setLoadingView(null);
        }
    };

    const handleEdit = async (id) => {
        try {
            console.log(`Fetching announcement for edit: /api/announcements/${id}`);
            const response = await api.get(`/api/announcements/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Edit announcement response:", JSON.stringify(response.data, null, 2));
            const announcement = response.data.data;
            formik.setValues({
                title: announcement.title,
                message: announcement.message,
                start_date: announcement.start_date,
                end_date: announcement.end_date,
                image: null,
            });
            setEditingId(id);
            setIsEditing(true);
        } catch (error) {
            console.error("Error loading announcement for edit:", error);
            console.log("Error details:", JSON.stringify(error.response?.data, null, 2));
            toast.error(error.response?.data?.message || "Failed to load announcement for editing.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        try {
            console.log(`Deleting announcement: /api/announcements/${id}`);
            const response = await api.delete(`/api/announcements/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Delete announcement response:", JSON.stringify(response.data, null, 2));
            if (response.data.status === "success") {
                toast.success(response.data.message || "Announcement deleted successfully.");
                setAnnouncements((prevAnnouncements) => {
                    const updatedAnnouncements = prevAnnouncements.filter((announcement) => announcement.id !== id);
                    if (updatedAnnouncements.length === 0 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    }
                    console.log("Updated announcements state:", JSON.stringify(updatedAnnouncements, null, 2));
                    return updatedAnnouncements;
                });
                fetchAnnouncements(currentPage);
            } else {
                toast.error(response.data.message || "Failed to delete announcement.");
            }
        } catch (error) {
            console.error("Error deleting announcement:", error);
            console.log("Error details:", JSON.stringify(error.response?.data, null, 2));
            toast.error(error.response?.data?.message || error.message || "Failed to delete announcement.");
        }
    };

    const handlePageChange = (pageUrl) => {
        if (!pageUrl) return;
        const page = new URL(pageUrl).searchParams.get("page");
        if (page) {
            console.log(`Changing to page: ${page}`);
            setCurrentPage(parseInt(page));
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
                <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
                    <p className="text-xl md:text-2xl font-semibold">{isEditing ? "Update Announcement" : "Create Announcement"}</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col w-full sm:w-1/2">
                            <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1">
                                Title {formik.touched.title && formik.errors.title && <span className="text-red-500 text-xs"> - {formik.errors.title}</span>}
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`h-12 px-4 py-2 border w-full ${formik.touched.title && formik.errors.title ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                            />
                        </div>
                        <div className="flex flex-col w-full sm:w-1/2">
                            <label htmlFor="start_date" className="text-sm font-medium text-gray-700 mb-1">
                                Start Date {formik.touched.start_date && formik.errors.start_date && <span className="text-red-500 text-xs"> - {formik.errors.start_date}</span>}
                            </label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                value={formik.values.start_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`h-12 px-4 py-2 border w-full ${formik.touched.start_date && formik.errors.start_date ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col w-full sm:w-1/2">
                            <label htmlFor="end_date" className="text-sm font-medium text-gray-700 mb-1">
                                End Date {formik.touched.end_date && formik.errors.end_date && <span className="text-red-500 text-xs"> - {formik.errors.end_date}</span>}
                            </label>
                            <input
                                type="date"
                                id="end_date"
                                name="end_date"
                                value={formik.values.end_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`h-12 px-4 py-2 border w-full ${formik.touched.end_date && formik.errors.end_date ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                            />
                        </div>
                        <div className="flex flex-col w-full sm:w-1/2">
                            <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-1">
                                Image {formik.touched.image && formik.errors.image && <span className="text-red-500 text-xs"> - {formik.errors.image}</span>}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500">
                                <FaImage size={40} className="mb-4" />
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        formik.setFieldValue("image", file);
                                        formik.setFieldTouched("image", true);
                                    }}
                                />
                                <div className="flex items-center gap-3">
                                    <label
                                        htmlFor="image"
                                        className="px-6 text-xs py-2 bg-pryClr text-black border border-black/50 rounded-lg cursor-pointer hover:bg-pryClr/90"
                                    >
                                        Choose File
                                    </label>
                                    {formik.values.image ? (
                                        <span className="text-sm text-gray-700">{formik.values.image.name}</span>
                                    ) : (
                                        <span className="text-sm text-gray-500">No file chosen</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="message" className="text-sm font-medium text-gray-700 mb-1">
                            Message {formik.touched.message && formik.errors.message && <span className="text-red-500 text-xs"> - {formik.errors.message}</span>}
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`h-24 px-4 py-2 border w-full ${formik.touched.message && formik.errors.message ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loadingSubmit}
                        className={`px-6 py-2 rounded-full w-full sm:w-auto ${loadingSubmit ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary/90"} text-white flex items-center justify-center`}
                    >
                        {loadingSubmit ? (
                            <FaSpinner className="animate-spin h-5 w-5 text-white" />
                        ) : (
                            isEditing ? "Update Announcement" : "Create Announcement"
                        )}
                    </button>
                </div>
            </form>

            <div className="w-full">
                <div className="bg-white border border-black/10 rounded-lg p-4 md:p-8">
                    <h3 className="text-xl font-semibold mb-4">All Announcements</h3>
                    {loadingAnnouncements ? (
                        <div className="flex items-center justify-center py-8">
                            <FaSpinner className="animate-spin h-8 w-8 text-primary" />
                        </div>
                    ) : announcements.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                            <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                            <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                            <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {announcements.map((announcement) => (
                                            <tr key={announcement.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {announcement.title || "N/A"}
                                                </td>
                                                <td className="px-6 py-6 text-sm text-gray-900 max-w-xs truncate">
                                                    {announcement.message || "N/A"}
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                                                    {announcement.start_date || "N/A"}
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                                                    {announcement.end_date || "N/A"}
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                                                    {announcement.image ? (
                                                        <img src={announcement.image} alt="Announcement" className="h-10 w-10 rounded object-cover" />
                                                    ) : (
                                                        "No Image"
                                                    )}
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-4">
                                                        <button
                                                            onClick={() => handleView(announcement.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="View"
                                                            disabled={loadingView === announcement.id}
                                                        >
                                                            {loadingView === announcement.id ? (
                                                                <FaSpinner className="animate-spin h-4 w-4" />
                                                            ) : (
                                                                <FaEye size={16} className="text-primary" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(announcement.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Edit"
                                                        >
                                                            <FaEdit size={16} className="text-primary" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(announcement.id)}
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
                            <div className="mt-4 flex justify-center space-x-2">
                                {paginationLinks.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(link.url)}
                                        disabled={!link.url || link.active}
                                        className={`px-4 py-2 rounded-full text-sm ${link.active
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
                        <p className="text-center text-gray-500 py-8">No announcements available</p>
                    )}
                </div>
            </div>

            {viewData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold mb-4">Announcement Details</h3>
                        <div className="flex flex-col gap-4">
                            <p><strong>ID:</strong> {viewData.id || "N/A"}</p>
                            <p><strong>Title:</strong> {viewData.title || "N/A"}</p>
                            <p><strong>Message:</strong> {viewData.message || "N/A"}</p>
                            <p><strong>Start Date:</strong> {viewData.start_date || "N/A"}</p>
                            <p><strong>End Date:</strong> {viewData.end_date || "N/A"}</p>
                            <div>
                                <strong>Image:</strong>
                                {viewData.image ? (
                                    <img src={viewData.image} alt="Announcement" className="h-20 w-20 rounded object-cover mt-2" />
                                ) : (
                                    <span className="ml-2">No Image</span>
                                )}
                            </div>
                            <p><strong>Created At:</strong> {viewData.created_at ? new Date(viewData.created_at).toLocaleString() : "N/A"}</p>
                            <p><strong>Updated At:</strong> {viewData.updated_at ? new Date(viewData.updated_at).toLocaleString() : "N/A"}</p>
                        </div>
                        <button
                            onClick={() => setViewData(null)}
                            className="mt-6 w-full bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;