import React from "react";
import { useFormik } from "formik";

const PackageModal = ({ pkg, onClose, onSubmit, submitting }) => {
  const formik = useFormik({
    initialValues: {
      packageName: pkg?.name || "",
      pointValue: pkg?.point_value || "",
      amount: pkg?.price || "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.packageName) errors.packageName = "Required";
      if (!values.pointValue) errors.pointValue = "Required";
      if (!values.amount) errors.amount = "Required";
      return errors;
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col gap-4"
        >
          <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
            <p className="text-xl md:text-2xl font-semibold">Manage Package</p>

            <div className="flex flex-col w-full">
              <label
                htmlFor="packageName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Package Name
                {formik.touched.packageName && formik.errors.packageName && (
                  <span className="text-red-500 text-xs">
                    {" "}
                    - {formik.errors.packageName}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="packageName"
                name="packageName"
                placeholder="Enter Package name"
                value={formik.values.packageName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${
                  formik.touched.packageName && formik.errors.packageName
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>

            <div className="flex flex-col w-full">
              <label
                htmlFor="pointValue"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Point Value
                {formik.touched.pointValue && formik.errors.pointValue && (
                  <span className="text-red-500 text-xs">
                    {" "}
                    - {formik.errors.pointValue}
                  </span>
                )}
              </label>
              <input
                type="number"
                id="pointValue"
                name="pointValue"
                placeholder="Enter Package Point Value"
                value={formik.values.pointValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${
                  formik.touched.pointValue && formik.errors.pointValue
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>

            <div className="flex flex-col w-full">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Amount
                {formik.touched.amount && formik.errors.amount && (
                  <span className="text-red-500 text-xs">
                    {" "}
                    - {formik.errors.amount}
                  </span>
                )}
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="Enter Package Amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${
                  formik.touched.amount && formik.errors.amount
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-full w-full sm:w-auto"
            >
              {submitting ? "Updating Package..." : "Update Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageModal;
