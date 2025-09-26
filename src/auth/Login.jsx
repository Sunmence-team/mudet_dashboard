import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import assets from "../assets/assets";

// Validation schema using Yup
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
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

              <Formik
                initialValues={{ username: "", password: "", rememberMe: false }}
                validationSchema={loginSchema}
                onSubmit={(values, { setSubmitting }) => {
                  console.log("Form submitted:", values);
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Username
                      </label>
                      <Field
                        type="text"
                        name="username"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pryClr transition duration-300 bg-white"
                        placeholder="Enter your username"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-600 text-sm mt-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pryClr transition duration-300 bg-white"
                        placeholder="Enter your password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-600 text-sm mt-1.5"
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center text-gray-700">
                        <Field
                          type="checkbox"
                          name="rememberMe"
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
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary text-white font-medium py-3 rounded-lg transition duration-300 disabled:opacity-50 shadow-lg"
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        {/* Desktop form section - unchanged */}
        <div className="hidden md:flex w-full h-full items-center justify-center bg-gray-50 md:bg-white md:rounded-l-3xl md:shadow-lg py-8 md:py-0">
          <div className="w-full  p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center md:text-left">
              Login
            </h2>
            <Formik
              initialValues={{ username: "", password: "", rememberMe: false }}
              validationSchema={loginSchema}
              onSubmit={(values, { setSubmitting }) => {
                console.log("Form submitted:", values);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pryClr transition duration-300 bg-white"
                      placeholder="Enter your username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-600 text-sm mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pryClr transition duration-300 bg-white"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 text-sm mt-1.5"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-700">
                      <Field
                        type="checkbox"
                        name="rememberMe"
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
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary text-white font-medium py-3 rounded-lg transition duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;