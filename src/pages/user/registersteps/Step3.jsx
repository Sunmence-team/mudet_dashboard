import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Step3 = forwardRef(({ prevStep, nextStep, formData = {}, updateFormData, setFormValidity }, ref) => {
  const { token } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
    password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
    password_confirmation: Yup.string()
      .required("Password confirmation is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      username: formData.username || "",
      password: formData.password || "",
      password_confirmation: formData.password_confirmation || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      // Log the form data in the desired format
      const logData = {
        success: true,
        message: "Step 3 completed successfully",
        current_step: 4,
        data: {
          username: values.username,
          password: values.password,
        },
      };
      console.log(JSON.stringify(logData, null, 2));

      try {
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          return;
        }

        const payload = {
          username: values.username,
          password: values.password,
          password_confirmation: values.password_confirmation,
        };

        const response = await api.post("/api/registration/step-3", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Session-ID": formData.session_id,
          },
        });

        if (response.data.success) {
          toast.success(response.data.message || "Step 3 completed successfully");
          updateFormData({
            ...response.data.data,
            session_id: formData.session_id,
          });
          nextStep();
        } else {
          toast.error(response.data.message || "Step 3 submission failed");
        }
      } catch (error) {
        console.error("Error during Step 3 submission:", error);
        toast.error(
          error.response?.data?.message || error.message || "An error occurred during Step 3 submission"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  useImperativeHandle(ref, () => ({
    submit: () => {
      formik.submitForm();
    },
  }));

  useEffect(() => {
    setFormValidity(formik.isValid && formik.dirty);
  }, [formik.isValid, formik.dirty, setFormValidity]);

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
        <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
          <p className="text-xl md:text-2xl font-semibold">Login Information</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1">
                Username{" "}
                {formik.touched.username && formik.errors.username && (
                  <span className="text-red-500 text-xs"> - {formik.errors.username}</span>
                )}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${
                  formik.touched.username && formik.errors.username ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-pryClr focus:border-pryClr`}
                disabled={submitting}
              />
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 gap-4">
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
                  Password{" "}
                  {formik.touched.password && formik.errors.password && (
                    <span className="text-red-500 text-xs"> - {formik.errors.password}</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-12 px-4 py-2 border w-full ${
                      formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-pryClr focus:border-pryClr pr-10`}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    disabled={submitting}
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 mb-1">
                  Password Confirmation{" "}
                  {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                    <span className="text-red-500 text-xs"> - {formik.errors.password_confirmation}</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirmation ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-12 px-4 py-2 border w-full ${
                      formik.touched.password_confirmation && formik.errors.password_confirmation
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-pryClr focus:border-pryClr pr-10`}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    disabled={submitting}
                  >
                    {showPasswordConfirmation ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

export default Step3;