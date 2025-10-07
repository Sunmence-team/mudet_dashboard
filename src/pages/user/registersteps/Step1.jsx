import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CiSearch } from "react-icons/ci";
import api from "../../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";



const Step1 = ({
  prevStep,
  nextStep,
  formData = {},
  updateFormData,
  setFormValidity,
}) => {
  const { token } = useUser()
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔥 State for plans
  const [packages, setPackages] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState(
    formData.package || ""
  );

  // ✅ Validation
  const validationSchema = Yup.object().shape({
    sponsor: Yup.string().required("Sponsor is required"),
    placement: Yup.string().required("Placement is required"),
    position: Yup.string().required("Position is required"),
  });

  const formik = useFormik({
    initialValues: {
      sponsor: formData.sponsor || "",
      placement: formData.placement || "",
      position: formData.position || "",
    },
    validationSchema,
    onSubmit: (values) => {
      updateFormData({ ...values, package: selectedPackage });
      nextStep();
    },
  });

  // ✅ Fetch plans dynamically
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const response = await api.get(`/api/plans/all`);
        console.log(response.data);

        // Adjust if response is {plans: [...]}
        setPackages(response.data.data.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load plans.");
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  // ✅ Update form validity dynamically
  useEffect(() => {
    setFormValidity(formik.isValid && formik.dirty && selectedPackage !== "");
  }, [formik.isValid, formik.dirty, selectedPackage, setFormValidity]);

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      {/* Sponsor / Placement / Position */}
      <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Sponsor Input</p>
        <div className="w-full flex flex-col md:flex-row gap-6">
          <div className="flex-[4] w-full flex flex-col gap-3">
            <p className="text--sm md:text-lg">Sponsor</p>
            <div className="w-full mx-auto">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Search for a sponsor"
                  className="flex-1 outline-none bg-transparent"
                  id="sponsor"
                  name="sponsor"
                  value={formik.values.sponsor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <CiSearch className="text-gray-500 cursor-pointer" />
              </div>
              {formik.touched.sponsor && formik.errors.sponsor && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.sponsor}
                </p>
              )}
            </div>
          </div>

          <div className="flex-[4] w-full flex flex-col gap-3">
            <p className="text--sm md:text-lg">Placement</p>
            <div className="w-full mx-auto">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Enter sponsor first"
                  className="flex-1 outline-none bg-transparent"
                  id="placement"
                  name="placement"
                  value={formik.values.placement}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <CiSearch className="text-gray-500 cursor-pointer" />
              </div>
              {formik.touched.placement && formik.errors.placement && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.placement}
                </p>
              )}
            </div>
          </div>

          <div className="flex-[2] w-full flex flex-col gap-3">
            <p className="text--sm md:text-lg">Position</p>
            <div className="flex w-full justify-between">
              <button
                type="button"
                className={`px-8 py-2 rounded-full ${
                  formik.values.position === "Left"
                    ? "bg-secondary text-white"
                    : "bg-white border border-black/50 text-black"
                }`}
                onClick={() => formik.setFieldValue("position", "Left")}
              >
                Left
              </button>
              <button
                type="button"
                className={`px-8 py-2 rounded-full ${
                  formik.values.position === "Right"
                    ? "bg-secondary text-white"
                    : "bg-white border border-black/50 text-black"
                }`}
                onClick={() => formik.setFieldValue("position", "Right")}
              >
                Right
              </button>
            </div>
            {formik.touched.position && formik.errors.position && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.position}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Package Selection */}
      <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Pick Your Package</p>
        {loadingPlans ? (
          <p className="text-center text-gray-500">Loading packages...</p>
        ) : packages.length > 0 ? (
          <div className="w-full overflow-x-auto mt-8">
            <div className="flex gap-6 min-w-max">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id || index}
                  className={`w-[270px] md:w-[300px] border border-black/10 flex flex-col rounded-2xl cursor-pointer ${
                    selectedPackage === pkg.name ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedPackage(pkg.name)}
                >
                  <div className="w-full h-18 bg-primary rounded-t-2xl flex items-center justify-center text-white text-center">
                    <p className="text-xl md:text-2xl font-bold">{pkg.name}</p>
                  </div>
                  <div className="py-6 flex flex-col gap-4 items-center justify-center">
                    <p className="text-3xl md:text-4xl font-bold">
                      {pkg.price}
                      <span className="text-sm font-light text-black/50">
                        NGN
                      </span>
                    </p>
                    <p className="text-black/70 text-[12px]">
                      Point Value: {pkg.point_value || pkg.pointValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No packages available</p>
        )}
      </div>

      <form onSubmit={formik.handleSubmit}>
        <button type="submit" style={{ display: "none" }}></button>
      </form>
    </div>
  );
};

export default Step1;
