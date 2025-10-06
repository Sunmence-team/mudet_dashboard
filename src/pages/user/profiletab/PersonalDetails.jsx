import React, { useState } from "react";
import { useUser } from "../../../context/UserContext";
import * as Yup from "yup";
import { useFormik } from "formik";
import api from "../../../utilities/api";
import { toast } from "sonner";
import axios from "axios";

const PersonalDetails = () => {
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .required("First name is required")
      .min(2, "Package Name must be at least 2 characters"),
    last_name: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["male", "female"], "Gender must be either male or female"),
    date_of_birth: Yup.string().required("Date of birth is required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      gender: user.gender || "",
      date_of_birth: user.date_of_birth || "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      console.log(values);
      try {
        const response = await api.put("/api/updatePersonal", values);
        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            "An unexpected error occurred while creating package. " +
              error?.response?.data?.message ||
              error?.message ||
              "Please try again later."
          );
          console.error("Error during creating package:", error);
        }
      } finally {
        setSubmitting(false);
        resetForm();
      }
    },
  });

  return (
    <form className="space-y-4 p-6" onSubmit={formik.handleSubmit}>
      {/* Full Name */}
      <div className="flex lg:items-center w-full lg:flex-row flex-col gap-5">
        <div className="lg:w-1/2">
          <label className="lg:text-sm font-medium text-black/80 mb-2 flex items-center gap-1 text-xs">
            First Name{" "}
            {formik.touched.first_name && formik.errors.first_name && (
              <span className="text-red-500">- {formik.errors.first_name}</span>
            )}
          </label>
          <input
            type="text"
            name="first_name"
            placeholder="Enter your full name"
            className={`w-full border rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
              formik.touched.first_name && formik.errors.first_name
                ? "border-red-500 text-transparent"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.first_name}
          />
        </div>
        <div className="lg:w-1/2">
          <label className="lg:text-sm font-medium text-black/80 mb-2 flex items-center gap-1 text-xs">
            Last Name
            {formik.touched.last_name && formik.errors.last_name && (
              <span className="text-red-500">- {formik.errors.last_name}</span>
            )}
          </label>
          <input
            type="text"
            name="last_name"
            placeholder="Enter your full name"
            className={`w-full border rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
              formik.touched.last_name && formik.errors.last_name
                ? "border-red-500 text-transparent"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.last_name}
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label className="lg:text-sm font-medium text-black/80 mb-2 flex items-center gap-1 text-xs">
          Date of Birth
          {formik.touched.date_of_birth && formik.errors.date_of_birth && (
            <span className="text-red-500">
              - {formik.errors.date_of_birth}
            </span>
          )}
        </label>
        <input
          type="date"
          name="date_of_birth"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.date_of_birth && formik.errors.date_of_birth
              ? "border-red-500 text-transparent"
              : "border-gray-300"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.date_of_birth}
        />
      </div>

      {/* Gender */}
      <div>
        <label className="lg:text-sm font-medium text-black/80 mb-2 flex items-center gap-1 text-xs">
          Gender
          {formik.touched.gender && formik.errors.gender && (
            <span className="text-red-500">- {formik.errors.gender}</span>
          )}
        </label>
        <select
          className={`w-full border rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.gender && formik.errors.gender
              ? "border-red-500 text-transparent"
              : "border-gray-300"
          }`}
          name="gender"
          value={formik.values.gender}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Button */}
      <button className="bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border-1 text-white text-sm font-medium py-4 px-5 rounded-4xl w-full">
        {submitting ? "Saving Details..." : "Save Details"}
      </button>
    </form>
  );
};

export default PersonalDetails;
