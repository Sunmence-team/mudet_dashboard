import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useUser } from "../../../context/UserContext";
import * as Yup from "yup";
import { useFormik } from "formik";
import api from "../../../utilities/api";
import { toast } from "sonner";
import axios from "axios";

const ResetPassword = () => {
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation schema for password reset
  const validationSchema = Yup.object().shape({
    old_password: Yup.string()
      .required("Old password is required")
      .min(8, "Old password must be at least 8 characters"),
    new_password: Yup.string()
      .required("New password is required")
      .min(8, "New password must be at least 8 characters")
      .notOneOf(
        [Yup.ref("old_password")],
        "New password must be different from old password"
      ),
    confirm_new_password: Yup.string()
      .required("Please confirm your new password")
      .oneOf([Yup.ref("new_password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      try {
        const response = await api.post("/api/profile/change-password", {
          user_id: user.id,
          old_password: values.old_password,
          new_password: values.new_password,
        });
        if (response.status === 200) {
          toast.success(response.data.message || "Password updated successfully!");
          resetForm();
        } else {
          toast.error(response.data.message || "Failed to update password.");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || "Failed to update password.");
        } else {
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "An unexpected error occurred. Please try again later."
          );
          console.error("Error during password reset:", error);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form className="space-y-4 p-6" onSubmit={formik.handleSubmit}>
      {/* Old Password */}
      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2 items-center gap-1">
          Old Password
          {formik.touched.old_password && formik.errors.old_password && (
            <span className="text-red-500"> - {formik.errors.old_password}</span>
          )}
        </label>
        <input
          type={showCurrent ? "text" : "password"}
          name="old_password"
          placeholder=""
          className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.old_password && formik.errors.old_password
              ? "border-red-500"
              : "border-gray-300"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.old_password}
        />
        <span
          onClick={() => setShowCurrent(!showCurrent)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showCurrent ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      {/* New Password */}
      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2  items-center gap-1">
          New Password
          {formik.touched.new_password && formik.errors.new_password && (
            <span className="text-red-500"> - {formik.errors.new_password}</span>
          )}
        </label>
        <input
          type={showNew ? "text" : "password"}
          name="new_password"
          placeholder=""
          className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.new_password && formik.errors.new_password
              ? "border-red-500"
              : "border-gray-300"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.new_password}
        />
        <p className="text-xs text-gray-400 mt-1">
          Must be at least 8 characters and different from old password
        </p>
        <span
          onClick={() => setShowNew(!showNew)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      {/* Confirm New Password */}
      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2 items-center gap-1">
          Confirm New Password
          {formik.touched.confirm_new_password &&
            formik.errors.confirm_new_password && (
              <span className="text-red-500">
                - {formik.errors.confirm_new_password}
              </span>
            )}
        </label>
        <input
          type={showConfirm ? "text" : "password"}
          name="confirm_new_password"
          placeholder=""
          className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.confirm_new_password &&
            formik.errors.confirm_new_password
              ? "border-red-500"
              : "border-gray-300"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirm_new_password}
        />
        <span
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border text-white text-sm font-medium py-4 px-5 rounded-4xl w-full"
        disabled={submitting}
      >
        {submitting ? "Updating Password..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
