import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import * as Yup from "yup";
import { useFormik } from "formik";
import api from "../../../utilities/api";
import { toast } from "sonner";
import axios from "axios";
import { useUser } from "../../../context/UserContext";

const ResetPin = () => {
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation schema
  const validationSchema = Yup.object().shape({
    old_pin: Yup.string()
      .required("Old PIN is required")
      .matches(/^\d{4}$/, "Old PIN must be exactly 4 digits"),
    new_pin: Yup.string()
      .required("New PIN is required")
      .matches(/^\d{4}$/, "New PIN must be exactly 4 digits")
      .notOneOf([Yup.ref("old_pin")], "New PIN must be different from old PIN"),
    confirm_new_pin: Yup.string()
      .required("Please confirm your new PIN")
      .oneOf([Yup.ref("new_pin"), null], "PINs must match"),
  });

  const formik = useFormik({
    initialValues: {
      old_pin: "",
      new_pin: "",
      confirm_new_pin: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log({
        user_id: user?.id,
        old_pin: values.old_pin, // Send as string
        new_pin: Number(values.new_pin), // Send as number
      });
      setSubmitting(true);
      try {
        const response = await api.post("/api/profile/change-pin", {
          user_id: user?.id,
          old_pin: values.old_pin, // Send as string
          new_pin: Number(values.new_pin), // Send as number
        });

        if (response.status === 200) {
          toast.success(response.data.message || "PIN updated successfully!");
          resetForm();
        } else {
          toast.error(response.data.message || "Failed to update PIN.");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || "Failed to update PIN.");
        } else {
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "An unexpected error occurred. Please try again later."
          );
          console.error("Error during PIN reset:", error);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form className="space-y-4 p-6" onSubmit={formik.handleSubmit}>
      {/* Old PIN */}
      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2">
          Old PIN
          {formik.touched.old_pin && formik.errors.old_pin && (
            <span className="text-red-500"> - {formik.errors.old_pin}</span>
          )}
        </label>
        <input
          type={showOld ? "text" : "password"}
          name="old_pin"
          maxLength={4}
          className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.old_pin && formik.errors.old_pin
              ? "border-red-500"
              : "border-gray-300"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.old_pin}
        />
        <span
          onClick={() => setShowOld(!showOld)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showOld ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      {/* New PIN */}
      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2">
          New PIN
          {formik.touched.new_pin && formik.errors.new_pin && (
            <span className="text-red-500"> - {formik.errors.new_pin}</span>
          )}
        </label>
        <input
          type={showNew ? "text" : "password"}
          name="new_pin"
          maxLength={4}
          className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.new_pin && formik.errors.new_pin
              ? "border-red-500"
              : "border-gray-300"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.new_pin}
        />
        <span
          onClick={() => setShowNew(!showNew)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>

      {/* Confirm New PIN */}
      <div className="relative">
        <label className="block text-sm font-medium text-black/80 mb-2">
          Confirm New PIN
          {formik.touched.confirm_new_pin && formik.errors.confirm_new_pin && (
            <span className="text-red-500">
              - {formik.errors.confirm_new_pin}
            </span>
          )}
        </label>
        <input
          type={showConfirm ? "text" : "password"}
          name="confirm_new_pin"
          maxLength={4}
          className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.confirm_new_pin && formik.errors.confirm_new_pin
              ? "border-red-500"
              : "border-gray-300"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirm_new_pin}
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
        {submitting ? "Updating PIN..." : "Reset PIN"}
      </button>
    </form>
  );
};

export default ResetPin;