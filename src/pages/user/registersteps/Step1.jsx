import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CiSearch } from "react-icons/ci";

const Step1 = ({
  prevStep,
  nextStep,
  formData = {},
  updateFormData,
  setFormValidity,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const packages = [
    {
      name: "Lunch Package",
      nameBgColor: "bg-primary",
      nameTextColor: "text-white",
      price: "14,000",
      pointValue: "10PV",
    },
    {
      name: "Ignite Package",
      nameBgColor: "bg-secondary",
      nameTextColor: "text-white",
      price: "28,000",
      pointValue: "30PV",
    },
    {
      name: "Momentum  Package",
      nameBgColor: "bg-primary",
      nameTextColor: "text-white",
      price: "70,000",
      pointValue: "80PV",
    },
    {
      name: "Power	 Package",
      nameBgColor: "bg-secondary",
      nameTextColor: "text-white",
      price: "182,000",
      pointValue: "200PV",
    },
    {
      name: "Scale Package",
      nameBgColor: "bg-primary",
      nameTextColor: "text-white",
      price: "406,000",
      pointValue: "500PV",
    },
    {
      name: "Turbo Package",
      nameBgColor: "bg-secondary",
      nameTextColor: "text-white",
      price: "700,000",
      pointValue: "700PV",
    },
    {
      name: "Legend Package",
      nameBgColor: "bg-primary",
      nameTextColor: "text-white",
      price: "1,050,000",
      pointValue: "1000PV",
    },
  ];

  const [selectedPackage, setSelectedPackage] = useState(
    formData.package || ""
  );

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

  useEffect(() => {
    setFormValidity(formik.isValid && formik.dirty && selectedPackage !== "");
  }, [formik.isValid, formik.dirty, selectedPackage, setFormValidity]);

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
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
            <p className="text--sm md:text-lg">Placement</p>
            <div className="flex w-full justify-between">
              <button
                className="bg-secondary text-white px-8 py-2 rounded-full"
                onClick={() => formik.setFieldValue("position", "Left")}
              >
                Left
              </button>
              <button
                className="bg-white border border-black/50 text-black px-8 py-2 rounded-full"
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
      <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Pick Your Package</p>
        <div className="w-full overflow-x-auto mt-8">
          <div className="flex gap-6 min-w-max">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`w-[270px] md:w-[300px] border border-black/10 flex flex-col rounded-2xl ${
                  selectedPackage === pkg.name ? "border-primary" : ""
                }`}
                onClick={() => setSelectedPackage(pkg.name)}
              >
                <div
                  className={`w-full h-18 ${
                    pkg.name.includes("Package") ? "bg-primary" : "bg-secondary"
                  } rounded-t-2xl flex items-center justify-center text-white text-center`}
                >
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
                    Point Value: {pkg.pointValue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <button type="submit" style={{ display: "none" }}></button>
      </form>
    </div>
  );
};

export default Step1;
