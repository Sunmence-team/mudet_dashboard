import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import assets from "../../assets/assets";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import api from "../../utilities/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Form submitted:", values);
      try {
        const response = await api.post(`/api/login`, values);
        console.log("Login response data:", response.data);
        if (response.status === 200) {
          const { token, role, user } = response.data;

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          await login(token);

          toast.success("Login successful");
          setTimeout(() => {
            toast("Redirecting to dashboard...");
            setTimeout(() => {
              role === "admin" ? navigate(`/admin/overview`) : navigate("/user/overview");
            }, 2000);
          }, 1000);
        }
      } catch (err) {
        console.error("Error during logging in:", err);
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          toast.error(err.response.data.message || "Validation error. Please check your inputs.");
        } else {
          toast.error("An unexpected error occurred while logging in. " + err?.response?.data?.message || err?.message || "Please try again later.");
          console.error("Error during logging in:", err);
        }
      } finally {
        setTimeout(() => {
          setSubmitting(false);
        }, 2000);
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Desktop layout - unchanged */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center items-center justify-center text-white p-8"
        style={{ backgroundImage: `url(${assets.pic22})` }}
      >
        <div className="flex flex-col gap-4">
          <h1 className="md:text-4xl lg:text-6xl font-medium">
            Hello <br /> <span className="font-extrabold">Welcome back</span>
          </h1>
          <p className="mt-4 md:text-xl lg:text-3xl">
            Welcome back! Log in to continue your journey to better health and
            wealth.
          </p>
        </div>
      </div>

      {/* Mobile layout with background image */}
      <div className="flex-1 md:w-1/2">
        {/* Background image for mobile with overlay */}
        <div
          className="md:hidden min-h-screen bg-cover bg-center bg-fixed relative"
          style={{ backgroundImage: `url(${assets.pic22})` }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Centered white container */}
          <div className="relative min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 mx-auto">
              {/* Welcome text for mobile inside the container */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome Back
                </h1>
                <p className="text-gray-600 mt-2">
                  Log in to continue your journey
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-gray-800 font-medium mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pryClr transition duration-300 bg-white"
                    placeholder="Enter your username"
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <p className="text-red-600 text-sm mt-1.5">
                      {formik.errors.username}
                    </p>
                  ) : null}
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-gray-800 font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pryClr transition duration-300 bg-white pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                  {formik.touched.password && formik.errors.password ? (
                    <p className="text-red-600 text-sm mt-1.5">
                      {formik.errors.password}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="rememberMe" className="flex items-center text-gray-700">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      onChange={formik.handleChange}
                      checked={formik.values.rememberMe}
                      className="mr-2 accent-pryClr h-4 w-4 rounded"
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-pryClr hover:text-pryClr-dark transition duration-200 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full bg-primary hover:bg-primary text-white font-medium py-3 rounded-lg transition duration-300 disabled:opacity-50 shadow-lg"
                >
                  {formik.isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Desktop form section - unchanged */}
        <div className="hidden md:flex w-full h-full items-center justify-center bg-gray-50 md:bg-white md:rounded-l-3xl md:shadow-lg py-8 md:py-0">
          <div className="w-full p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center md:text-left">
              Login
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-gray-800 font-medium mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pryClr transition duration-300 bg-white"
                  placeholder="Enter your username"
                />
                {formik.touched.username && formik.errors.username ? (
                  <p className="text-red-600 text-sm mt-1.5">
                    {formik.errors.username}
                  </p>
                ) : null}
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-gray-800 font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pryClr transition duration-300 bg-white pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
                {formik.touched.password && formik.errors.password ? (
                  <p className="text-red-600 text-sm mt-1.5">
                    {formik.errors.password}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label htmlFor="rememberMe" className="flex items-center text-gray-700">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.rememberMe}
                    className="mr-2 accent-pryClr h-4 w-4 rounded"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-pryClr hover:text-pryClr-dark transition duration-200 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-primary hover:bg-primary text-white font-medium py-3 rounded-lg transition duration-300 disabled:opacity-50 shadow-lg"
              >
                {formik.isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;