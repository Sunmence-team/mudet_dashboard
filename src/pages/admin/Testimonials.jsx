import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import { FaImage, FaEye, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import * as Yup from "yup";
import api from "../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

const Testimonials = forwardRef(({ prevStep, nextStep, formData = {}, updateFormData, setFormValidity }, ref) => {
  const { token } = useUser();
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingView, setLoadingView] = useState(null); // Track loading for each View button
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewData, setViewData] = useState(null); // Store testimonial data for popup

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }
      const response = await api.get("/api/testimonial/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Fetched testimonials:", JSON.stringify(response.data, null, 2));
      setTestimonials(response.data.data?.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error(error.response?.data?.message || "Failed to fetch testimonials.");
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    rating: Yup.number().required("Rating is required").min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
    comment: Yup.string().required("Comment is required"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileType", "Image must be a JPEG, PNG, or JPG file", (value) => {
        if (!value) return false;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: formData.name || "",
      rating: formData.rating || "",
      comment: formData.comment || "",
      image: formData.image || null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadingSubmit(true);
      try {
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          return;
        }

        const payload = new FormData();
        payload.append("full_name", values.name.trim());
        payload.append("rating", values.rating);
        payload.append("comment", values.comment);
        payload.append("image", values.image);

        const url = isEditing
          ? `/api/testimonial/update/${editingId}`
          : "/api/testimonial/create";

        const response = await api.post(url, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.status === "success") {
          toast.success(response.data.message || "Testimonial created successfully");
          fetchTestimonials();
          formik.resetForm();
          setIsEditing(false);
        } else {
          toast.error(response.data.message || "Failed to create testimonial.");
        }
      } catch (error) {
        console.error("Error submitting testimonial:", error);
        const msg =
          error.response?.data?.message ||
          error.response?.data?.errors?.image?.join(", ") ||
          "Failed to create testimonial.";
        toast.error(msg);
      } finally {
        setLoadingSubmit(false);
      }
    },

  });

  useImperativeHandle(ref, () => ({
    submit: formik.submitForm,
  }));

  const handleView = async (id) => {
    setLoadingView(id);
    try {
      const response = await api.get(`/api/testimonial/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("View testimonial response:", JSON.stringify(response.data, null, 2));
      setViewData(response.data.data); // Open popup with data
    } catch (error) {
      console.error("Error viewing testimonial:", error);
      toast.error(error.response?.data?.message || "Failed to view testimonial.");
    } finally {
      setLoadingView(null);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/testimonial/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Edit testimonial response:", JSON.stringify(response.data, null, 2));
      const testimonial = response.data.data;
      formik.setValues({
        name: testimonial.full_name,
        rating: testimonial.rating,
        comment: testimonial.comment,
        image: null,
      });
      setEditingId(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Error loading testimonial for edit:", error);
      toast.error(error.response?.data?.message || "Failed to load testimonial for editing.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const response = await api.delete(`/api/testimonial/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete testimonial response:", JSON.stringify(response.data, null, 2));
      if (response.data.status === "success") {
        toast.success(response.data.message || "Testimonial deleted successfully.");
        fetchTestimonials();
      } else {
        toast.error(response.data.message || "Failed to delete testimonial.");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete testimonial.");
    }
  };

  useEffect(() => {
    if (setFormValidity) {
      setFormValidity(formik.isValid && formik.dirty);
    }
  }, [formik.isValid, formik.dirty, setFormValidity]);

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
        <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
          <p className="text-xl md:text-2xl font-semibold">{isEditing ? "Update Testimonial" : "Create Testimonial"}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
                Name {formik.touched.name && formik.errors.name && <span className="text-red-500 text-xs"> - {formik.errors.name}</span>}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="rating" className="text-sm font-medium text-gray-700 mb-1">
                Rating {formik.touched.rating && formik.errors.rating && <span className="text-red-500 text-xs"> - {formik.errors.rating}</span>}
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formik.values.rating}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="1"
                max="5"
                className={`h-12 px-4 py-2 border w-full ${formik.touched.rating && formik.errors.rating ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="comment" className="text-sm font-medium text-gray-700 mb-1">
              Comment {formik.touched.comment && formik.errors.comment && <span className="text-red-500 text-xs"> - {formik.errors.comment}</span>}
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-24 px-4 py-2 border w-full ${formik.touched.comment && formik.errors.comment ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
            />
          </div>
          <div className="flex flex-col">
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
          <button
            type="submit"
            disabled={loadingSubmit}
            className={`px-6 py-2 rounded-full w-full sm:w-auto ${loadingSubmit ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary/90"} text-white flex items-center justify-center`}
          >
            {loadingSubmit ? (
              <FaSpinner className="animate-spin h-5 w-5 text-white" />
            ) : (
              isEditing ? "Update Testimonial" : "Create Testimonial"
            )}
          </button>
        </div>
      </form>

      {/* Testimonials Table */}
      <div className="w-full">
        <div className="bg-white border border-black/10 rounded-lg p-4 md:p-8">
          <h3 className="text-xl font-semibold mb-4">All Testimonials</h3>
          {loadingTestimonials ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : testimonials.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="hover:bg-gray-50">
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                        {testimonial.full_name || "N/A"}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                        {testimonial.rating || "N/A"}
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-900 max-w-xs truncate">
                        {testimonial.comment || "N/A"}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                        {testimonial.image ? (
                          <img src={testimonial.image} alt="Testimonial" className="h-10 w-10 rounded object-cover" />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleView(testimonial.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                            disabled={loadingView === testimonial.id}
                          >
                            {loadingView === testimonial.id ? (
                              <FaSpinner className="animate-spin h-4 w-4" />
                            ) : (
                              <FaEye size={16} className="text-primary" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(testimonial.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <FaEdit size={16} className="text-primary" />
                          </button>
                          <button
                            onClick={() => handleDelete(testimonial.id)}
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
          ) : (
            <p className="text-center text-gray-500 py-8">No testimonials available</p>
          )}
        </div>
      </div>

      {/* View Popup */}
      {viewData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Testimonial Details</h3>
            <div className="flex flex-col gap-4">
              <p><strong>ID:</strong> {viewData.id || "N/A"}</p>
              <p><strong>Name:</strong> {viewData.full_name || "N/A"}</p>
              <p><strong>Rating:</strong> {viewData.rating || "N/A"}</p>
              <p><strong>Comment:</strong> {viewData.comment || "N/A"}</p>
              <div>
                <strong>Image:</strong>
                {viewData.image ? (
                  <img src={viewData.image} alt="Testimonial" className="h-20 w-20 rounded object-cover mt-2" />
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
});

export default Testimonials;