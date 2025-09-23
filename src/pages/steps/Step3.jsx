import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Step3 = ({ prevStep, nextStep, formData = {}, updateFormData, setFormValidity }) => {
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
    onSubmit: (values) => {
      updateFormData(values);
      nextStep();
    },
  });

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
                Username {formik.touched.username && formik.errors.username && <span className="text-red-500 text-xs"> - {formik.errors.username}</span>}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.username && formik.errors.username ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 gap-4">
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
                  Password {formik.touched.password && formik.errors.password && <span className="text-red-500 text-xs"> - {formik.errors.password}</span>}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-12 px-4 py-2 border ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 mb-1">
                  Password Confirmation {formik.touched.password_confirmation && formik.errors.password_confirmation && <span className="text-red-500 text-xs"> - {formik.errors.password_confirmation}</span>}
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formik.values.password_confirmation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-12 px-4 py-2 border ${formik.touched.password_confirmation && formik.errors.password_confirmation ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Step3;