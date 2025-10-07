import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEdit, FaTrash } from "react-icons/fa"; // Using FaPlus for image upload icon
import api from "../../utilities/api";
import { toast } from "sonner";
import axios from "axios";
import PackageModal from "../../components/modals/PackageModal";
import Spinner from "../../components/Spinner";
import WarningModal from "../../components/modals/WarningModal";

const PackageUpload = ({
  prevStep,
  nextStep,
  formData = {},
  updateFormData,
  setFormValidity,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activePackage, setActivePackage] = useState({});
  const [packages, setPackages] = useState([]);
  const [updatingPackage, setUpdatingPackage] = useState(false);
  const [deletingPackage, setDeletingPackage] = useState(false);
  const [fetchingPackage, setFetchingPackage] = useState(false);
  const fetchPackages = async () => {
    setFetchingPackage(true);
    try {
      const response = await api.get("/api/plans/all");
      console.log(response.data.data.data);
      setPackages(response.data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingPackage(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [submitting, setSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    packageName: Yup.string()
      .required("Product Name is required")
      .min(2, "Package Name must be at least 2 characters"),
    amount: Yup.number()
      .required("Amount is required")
      .min(0, "Price must be at least 0"),
    pointValue: Yup.number()
      .required("Point Value is required")
      .min(0, "Point Value must be at least 0"),
  });

  const formik = useFormik({
    initialValues: {
      packageName: formData.productName || "",
      amount: formData.amount || "",
      pointValue: formData.pointValue || "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      try {
        const response = await api.post("/api/plans", {
          ...values,
          name: values.packageName,
          price: values.amount,
          point_value: values.pointValue,
        });
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
        fetchPackages();
        resetForm();
      }
    },
  });

  const handleEditPackage = async (values) => {
    setUpdatingPackage(true);
    try {
      const response = await api.put(`/api/plans/${activePackage.id}`, {
        ...values,
        price: values.amount,
        point_value: values.pointValue,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setModalOpen(false);
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
          "An unexpected error occurred while updating package. " +
            error?.response?.data?.message ||
            error?.message ||
            "Please try again later."
        );
        console.error("Error during updating package:", error);
      }
    } finally {
      setUpdatingPackage(false);
      fetchPackages();
    }
  };

  const handleDeletePackage = async () => {
    setDeletingPackage(true);
    try {
      const response = await api.delete(`/api/plans/${activePackage.id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setDeleteModalOpen(false);
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
          "An unexpected error occurred while deleting package. " +
            error?.response?.data?.message ||
            error?.message ||
            "Please try again later."
        );
        console.error("Error during deleting package:", error);
      }
    } finally {
      setDeletingPackage(false);
      fetchPackages();
    }
  };

  useEffect(() => {
    if (setFormValidity) {
      setFormValidity(formik.isValid && formik.dirty);
    }
  }, [formik.isValid, formik.dirty, setFormValidity]);


  return (
    <>
      <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col gap-4"
        >
          <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
            <p className="text-xl md:text-2xl font-semibold">Create Package</p>
            <div className="flex flex-col w-full">
              <label
                htmlFor="packageName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Product Name{" "}
                {formik.touched.packageName && formik.errors.packageName && (
                  <span className="text-red-500 text-xs">
                    {" "}
                    - {formik.errors.packageName}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="productName"
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
                Point Value{" "}
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
                Amount{" "}
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
              {submitting ? "Uploading Package..." : "Upload Package"}
            </button>
          </div>
        </form>
        <div className="bg-white border border-black/10 w-full flex flex-col gap-6 lg:p-8 p-5 rounded-lg">
          <p className="text-xl md:text-2xl font-semibold">Packages</p>
          <div className="w-full">
            {fetchingPackage ? (
              <Spinner />
            ) : packages.length === 0 ? (
              <div className="w-full flex items-center justify-center py-12">
                <div className="text-gray-500 text-lg font-medium">
                  Seems there are no packages or we couldn't fetch them.
                </div>
              </div>
            ) : (
              <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-9">
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className="relative group w-[270px] md:w-[300px] border border-black/10 flex flex-col rounded-2xl overflow-hidden lg:mx-0 mx-auto"
                    onMouseOver={() => setActivePackage(pkg)}
                  >
                    <div
                      className={`h-18 ${
                        pkg.name.includes("Package")
                          ? "bg-primary"
                          : "bg-secondary"
                      } rounded-t-2xl flex items-center justify-center text-white text-center`}
                    >
                      <p className="text-xl md:text-2xl font-bold">
                        {pkg.name}
                      </p>
                    </div>

                    <div className="py-6 flex flex-col gap-4 items-center justify-center group-hover:blur-sm transition duration-300">
                      <p className="text-3xl md:text-4xl font-bold">
                        {pkg.price.toLocaleString()}
                        <span className="text-sm font-light text-black/50">
                          {" "}
                          NGN
                        </span>
                      </p>
                      <p className="text-black/70 text-[12px]">
                        Point Value: {pkg.point_value}PV
                      </p>
                    </div>

                    <div className="absolute inset-0 hidden md:flex sm:hidden items-end justify-center pb-9 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                      <div className="flex gap-4">
                        <button
                          className="flex gap-1 items-center cursor-pointer px-4 py-2 bg-primary/90 text-white rounded-lg hover:bg-primary transition"
                          onClick={() => setModalOpen(true)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="flex gap-1 items-center cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          onClick={() => setDeleteModalOpen(true)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>

                    <div className="flex md:hidden items-center w-full justify-between gap-3 p-4 border-t border-black/10 bg-white">
                      <button
                        className="flex gap-1 items-center cursor-pointer px-3 py-2 bg-primary/90 text-white rounded-lg hover:bg-primary transition text-sm"
                        onClick={() => setModalOpen(true)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="flex gap-1 items-center cursor-pointer px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        onClick={() => setDeleteModalOpen(true)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen ? (
        <PackageModal
          pkg={activePackage}
          onClose={() => setModalOpen(false)}
          onSubmit={handleEditPackage}
          submitting={updatingPackage}
        />
      ) : null}
      {isDeleteModalOpen ? (
        <WarningModal
          title={"Are you sure you want to delete this package?"}
          message={`Clicking the confirm button will delete ${
            activePackage.name ? `the ${activePackage.name}` : "this package"
          } permanently.`}
          negativeAction={() => setDeleteModalOpen(false)}
          positiveAction={handleDeletePackage}
          isPositive={deletingPackage}
        />
      ) : null}
    </>
  );
};

export default PackageUpload;
