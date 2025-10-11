import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import { FaImage, FaEye, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import * as Yup from "yup";
import api from "../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import LazyLoader from "../../components/loaders/LazyLoader";
import { formatISODateToCustom } from "../../utilities/formatterutility";
import PaginationControls from "../../utilities/PaginationControls";

const Testimonials = forwardRef(({ prevStep, nextStep, formData = {}, updateFormData, setFormValidity, setSubmitting }, ref) => {
  const { token } = useUser();
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(2);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTestimonials();
  }, [token]);

  const fetchTestimonials = async () => {
    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        setSubmitting(false);
        return;
      }
      const response = await api.get("/api/testimonial/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          perPage: perPage,
        },
      });
      console.log("response", response)
      if (response.status === 200) {
        const { data, current_page, last_page, per_page } = response.data.data;
        setTestimonials(data || []);
        setCurrentPage(current_page);
        setLastPage(last_page);
        setPerPage(per_page);
      }
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
    position: Yup.string().required("Position is required"),
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
      position: formData.position || "",
      image: formData.image || null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoadingSubmit(true);
      setSubmitting(true);
      try {
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          setSubmitting(false);
          return false;
        }

        const payload = new FormData();
        payload.append("full_name", values.name.trim());
        payload.append("rating", values.rating);
        payload.append("comment", values.comment);
        payload.append("position", values.position.trim());
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

        console.log("response", response)

        if ((response.status === 200 || response.status === 201) && response.data.status === "success") {
          toast.success(response.data.message || "Testimonial created successfully");
          fetchTestimonials();
          formik.resetForm();
          setIsEditing(false);
          setEditingId(null);
          updateFormData({
            name: values.name,
            rating: values.rating,
            comment: values.comment,
            position: values.position,
            image: values.image,
          });
          return true;
        } else {
          toast.error(response.data.message || "Failed to create testimonial.");
          setSubmitting(false);
          return false;
        }
      } catch (error) {
        console.error("Error submitting testimonial:", error);
        const msg =
          error.response?.data?.message ||
          error.response?.data?.errors?.image?.join(", ") ||
          "Failed to create testimonial.";
        toast.error(msg);
        setSubmitting(false);
        return false;
      } finally {
        setLoadingSubmit(false);
      }
    },
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        setSubmitting(false);
        return false;
      }
      return formik.submitForm();
    },
  }));

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/testimonial/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const testimonial = response.data.data;
      window.scrollTo(0, 0);
      formik.setValues({
        name: testimonial.full_name,
        rating: testimonial.rating,
        comment: testimonial.comment,
        position: testimonial.position,
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
      console.log("response", response)
      if (response.status === 200) {
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
    <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
        <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
          <p className="text-xl md:text-2xl font-semibold">{isEditing ? "Update Testimonial" : "Create Testimonial"}</p>
          <div className="flex flex-col w-full">
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="position" className="text-sm font-medium text-gray-700 mb-1">
                Position {formik.touched.position && formik.errors.position && <span className="text-red-500 text-xs"> - {formik.errors.position}</span>}
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formik.values.position}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.position && formik.errors.position ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
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
          <div className="flex flex-col w-full">
            <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-1">
              Image {formik.touched.image && formik.errors.image && <span className="text-red-500 text-xs"> - {formik.errors.image}</span>}
            </label>
            <div className="h-full min-h-[160px] border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500">
              <FaImage size={32} className="mb-2" />
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
          <div className="flex flex-col w-full">
            <label htmlFor="comment" className="text-sm font-medium text-gray-700 mb-1">
              Comment {formik.touched.comment && formik.errors.comment && <span className="text-red-500 text-xs"> - {formik.errors.comment}</span>}
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-full min-h-[160px] px-4 py-2 border w-full ${
                formik.touched.comment && formik.errors.comment ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-pryClr focus:border-pryClr resize-none`}
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
              isEditing ? "Update Testimonial" : "Create Testimonial"
            )}
          </button>
        </div>
      </form>

      {/* Testimonials Table */}
      <div className="w-full mt-8">
        <h3 className="text-xl font-semibold mb-4">All Testimonials</h3>
        {loadingTestimonials ? (
          <div className="flex items-center justify-center py-8">
            <LazyLoader color={"#2b7830"} size={32} />
          </div>
        ) : testimonials.length > 0 ? (
          <div className="overflow-x-auto styled-scrollbar">
            <table className="min-w-full">
              <thead>
                <tr className="font-semibold">
                  <th className="py-4 ps-2 text-start text-xs text-gray-500 uppercase">Name</th>
                  <th className="p-4 text-center text-xs text-gray-500 uppercase">Position</th>
                  <th className="p-4 text-center text-xs text-gray-500 uppercase">Rating</th>
                  <th className="p-4 text-center text-xs text-gray-500 uppercase">Comment</th>
                  <th className="p-4 text-center text-xs text-gray-500 uppercase">Image</th>
                  <th className="py-4 pe-2 text-end text-xs text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="bg-white text-sm text-center">
                    <td className="p-3 text-start rounded-s-xl border-y border-s-1 border-black/10 capitalize">
                      {testimonial.full_name || "N/A"}
                    </td>
                    <td className="p-4 border-y border-black/10 capitalize">
                      {testimonial.position || "N/A"}
                    </td>
                    <td className="p-4 border-y border-black/10">
                      {testimonial.rating || "N/A"}
                    </td>
                    <td className="p-4 border-y border-black/10">
                      <p className="line-clamp-1 max-w-xs mx-auto text-center">
                        {testimonial.comment || "N/A"}
                      </p>
                    </td>
                    <td className="p-4 border-y border-black/10">
                      {testimonial.image ? (
                        <img
                          src={`${imageBaseUrl}/${testimonial.image}`}
                          alt="Testimonial"
                          className="border border-gray-300 rounded-lg h-10 w-10 mx-auto object-cover"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="p-3 text-start rounded-e-xl border-y border-e-1 border-black/10">
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setSelectedTestimonial(testimonial)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <FaEye size={16} className="text-primary" />
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
            {!loadingTestimonials && testimonials.length > 0 && (
              <div className="flex justify-center items-center gap-2 p-4">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={lastPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No testimonials available</p>
        )}
      </div>

      {/* View Popup */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4 shadow-xl">
            <div className="w-full max-h-[400px] overflow-y-scroll styled-scrollbar">
              <h3 className="text-xl font-semibold mb-4">Testimonial Details</h3>
              <div className="flex flex-col gap-3 text-sm text-gray-700">
                <p><strong>Name:</strong> {selectedTestimonial.full_name || "N/A"}</p>
                <div className="flex md:flex-row flex-col items-center justify-between">
                  <p><strong>Position:</strong> {selectedTestimonial.position || "N/A"}</p>
                  <p><strong>Rating:</strong> {selectedTestimonial.rating || "N/A"}</p>
                </div>
                <p><strong>Comment:</strong> {selectedTestimonial.comment+"Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem nobis asperiores ratione maxime error autem fugiat alias praesentium dolorum quo! Error fuga unde eligendi illum, dolorem labore natus eaque, in tempore perspiciatis ipsum adipisci cumque esse facere eum delectus doloremque deserunt dolor blanditiis ab magnam nam ipsa. Nostrum fuga enim obcaecati nemo animi. Voluptates quasi possimus dignissimos atque provident repellat natus minus voluptate. Architecto ex harum dolores enim, temporibus aperiam, ducimus expedita nisi modi perspiciatis hic atque est ipsa dolorem dignissimos! Id quaerat harum natus quia adipisci maxime ipsum deleniti ipsa? Alias adipisci voluptate, veritatis itaque rerum beatae repellendus deserunt?" || "N/A"}</p>
                <div>
                  <strong>Image:</strong>
                  {selectedTestimonial.image ? (
                    <img
                      src={`${imageBaseUrl}/${selectedTestimonial.image}`}
                      alt="Testimonial"
                      className="border border-gray-300 rounded-lg h-20 w-20 object-cover mt-2"
                    />
                  ) : (
                    <span className="ml-2">No Image</span>
                  )}
                </div>
                <p><strong>Date:</strong> {formatISODateToCustom(selectedTestimonial.created_at) || "N/A"}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTestimonial(null)}
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