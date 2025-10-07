import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";

const ContactDetails = () => {
  const { user } = useUser();
  const [submitting,setSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: user.email || "",
      mobile: user.mobile || "",
      address1: user.address1 || "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      mobile: Yup.string()
        .matches(/^[0-9]{10,15}$/i, "Enter a valid mobile number")
        .required("mobile number is required"),
      address1: Yup.string()
        .min(10, "Address is too short")
        .required("Address is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await api.put("/api/updateContact", values);
        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.message ||
            "An unexpected error occurred while updating bank details."
        );
      } finally {
        setSubmitting(false);
        resetForm();
      }
    },
  });

  return (
    <form className="space-y-4 p-6" onSubmit={formik.handleSubmit}>
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-1 outline-none ${
            formik.touched.email && formik.errors.email
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-[var(--color-primary)]"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
        )}
      </div>

      {/* mobile Number */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Mobile Number
        </label>
        <input
          type="tel"
          name="mobile"
          placeholder="Enter your mobile number"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-1 outline-none ${
            formik.touched.mobile && formik.errors.mobile
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-[var(--color-primary)]"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.mobile}
        />
        {formik.touched.mobile && formik.errors.mobile && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Address
        </label>
        <textarea
          name="address1"
          placeholder="Enter your address"
          rows={3}
          className={`w-full border rounded-lg px-4 py-2 focus:ring-1 outline-none ${
            formik.touched.address1 && formik.errors.address1
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-[var(--color-primary)]"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.address1}
        />
        {formik.touched.address1 && formik.errors.address1 && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.address1}</p>
        )}
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border text-white text-sm font-medium py-4 px-5 rounded-4xl w-full"
      >
        {submitting ? "Saving Contact Details...." : "Save Contact Details"}
      </button>
    </form>
  );
};

export default ContactDetails;
