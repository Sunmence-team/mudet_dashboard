import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import { CiSearch } from "react-icons/ci";

const Step1 = forwardRef(({
  prevStep,
  nextStep,
  formData = {},
  updateFormData,
  setFormValidity,
  setSubmitting,
}, ref) => {
  const { token } = useUser();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [packages, setPackages] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(formData.plan || null);
  const [sponsorNameDisplay, setSponsorNameDisplay] = useState("");
  const [sponsorConfirmed, setSponsorConfirmed] = useState(false);
  const [sponsorId, setSponsorId] = useState(null);
  const [validatingSponsor, setValidatingSponsor] = useState(false);
  const [placementNameDisplay, setPlacementNameDisplay] = useState("");
  const [placementConfirmed, setPlacementConfirmed] = useState(false);
  const [placementId, setPlacementId] = useState(null);
  const [validatingPlacement, setValidatingPlacement] = useState(false);

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
    onSubmit: async (values) => {
      if (!sponsorConfirmed) {
        toast.error("Please validate the sponsor username");
        setSubmitting(false);
        return false;
      }
      if (!placementConfirmed) {
        toast.error("Please validate the placement username");
        setSubmitting(false);
        return false;
      }
      if (!selectedPackage) {
        toast.error("Please select a package");
        setSubmitting(false);
        return false;
      }

      setSubmitting(true);
      try {
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          setSubmitting(false);
          return false;
        }

        const payload = {
          sponsor: sponsorId,
          placement: placementId,
          leg: values.position.toLowerCase(),
          plan: selectedPackage,
        };

        const response = await api.post("/api/registration/step-1", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedResponse = {
          success: response.data.success,
          message: response.data.message || "Step 1 completed successfully",
          session_id: response.data.session_id,
          current_step: 2,
          data: {
            sponsor: sponsorId,
            placement: placementId,
            leg: values.position.toLowerCase(),
            plan: selectedPackage,
          },
        };

        console.log(JSON.stringify(formattedResponse, null, 2));

        if (response.data.success) {
          toast.success(response.data.message);
          updateFormData({
            ...response.data.data,
            session_id: response.data.session_id,
          });
          nextStep();
          return true;
        } else {
          console.error("Step 1 failed:", response.data.message);
          toast.error(response.data.message || "Step 1 submission failed");
          setSubmitting(false);
          return false;
        }
      } catch (error) {
        console.error("Error during Step 1 submission:", error);
        toast.error(error.response?.data?.message || error.message || "Error submitting");
        setSubmitting(false);
        return false;
      }
    },
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        setSubmitting(false);
        return false;
      }
      return formik.submitForm();
    },
  }));

  const fetchSponsor = async (username) => {
    try {
      setValidatingSponsor(true);
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        setSponsorNameDisplay("Authentication required");
        setSponsorConfirmed(false);
        setSponsorId(null);
        return;
      }

      const response = await api.post("/api/validate-username", { username }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === "Username validated successfully" && response.data.data) {
        setSponsorNameDisplay(`${response.data.data.first_name} ${response.data.data.last_name}`);
        setSponsorConfirmed(true);
        setSponsorId(response.data.data.id);
        toast.success("Sponsor username validated successfully");
      } else {
        setSponsorNameDisplay("User not found");
        setSponsorConfirmed(false);
        setSponsorId(null);
        toast.error(response.data.message || "Invalid sponsor username");
      }
    } catch (error) {
      console.error("Error validating sponsor:", error);
      setSponsorNameDisplay("Error validating user");
      setSponsorConfirmed(false);
      setSponsorId(null);
      toast.error(error.response?.data?.message || error.message || "Error validating sponsor username");
    } finally {
      setValidatingSponsor(false);
    }
  };

  const fetchPlacement = async (username) => {
    try {
      setValidatingPlacement(true);
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        setPlacementNameDisplay("Authentication required");
        setPlacementConfirmed(false);
        setPlacementId(null);
        return;
      }

      const response = await api.post("/api/validate-username", { username }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === "Username validated successfully" && response.data.data) {
        setPlacementNameDisplay(`${response.data.data.first_name} ${response.data.data.last_name}`);
        setPlacementConfirmed(true);
        setPlacementId(response.data.data.id);
        toast.success("Placement username validated successfully");
      } else {
        setPlacementNameDisplay("User not found");
        setPlacementConfirmed(false);
        setPlacementId(null);
        toast.error(response.data.message || "Invalid placement username");
      }
    } catch (error) {
      console.error("Error validating placement:", error);
      setPlacementNameDisplay("Error validating user");
      setPlacementConfirmed(false);
      setPlacementId(null);
      toast.error(error.response?.data?.message || error.message || "Error validating placement username");
    } finally {
      setValidatingPlacement(false);
    }
  };

  const handleConfirmSponsor = () => {
    if (formik.values.sponsor) {
      fetchSponsor(formik.values.sponsor);
    } else {
      toast.error("Please enter a sponsor username");
    }
  };

  const handleConfirmPlacement = () => {
    if (formik.values.placement) {
      fetchPlacement(formik.values.placement);
    } else {
      toast.error("Please enter a placement username");
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          setSubmitting(false);
          return;
        }
        const response = await api.get("/api/plans/all", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Plans fetched successfully:", response.data);
        // Reverse packages to display last one first (lowest price first)
        const sortedPackages = (response.data.data.data || []).reverse();
        setPackages(sortedPackages);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load plans.");
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [token]);

  useEffect(() => {
    setFormValidity(formik.isValid && formik.dirty && selectedPackage !== null && sponsorConfirmed && placementConfirmed);
  }, [formik.isValid, formik.dirty, selectedPackage, sponsorConfirmed, placementConfirmed, setFormValidity]);

  return (
    <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
      <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Sponsor Input</p>
        <div className="w-full flex flex-col md:flex-row gap-12">
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
                  onChange={(e) => {
                    formik.handleChange(e);
                    setSponsorConfirmed(false);
                    setSponsorNameDisplay("");
                    setSponsorId(null);
                  }}
                  onBlur={formik.handleBlur}
                />
                <CiSearch
                  className="text-gray-500 cursor-pointer"
                  onClick={handleConfirmSponsor}
                />
              </div>
              {formik.touched.sponsor && formik.errors.sponsor && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.sponsor}
                </p>
              )}
            </div>
            {sponsorNameDisplay && (
              <div className="flex flex-col w-full">
                <label
                  htmlFor="sponsorFullName"
                  className="text-xs font-medium text-gray-700 mb-1"
                >
                  Sponsor Full Name
                </label>
                <p className={`text-xs text-gray-600 mt-1 ${sponsorConfirmed ? "" : "text-red-500"}`}>
                  {sponsorNameDisplay}
                </p>
              </div>
            )}
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
                  onChange={(e) => {
                    formik.handleChange(e);
                    setPlacementConfirmed(false);
                    setPlacementNameDisplay("");
                    setPlacementId(null);
                  }}
                  onBlur={formik.handleBlur}
                />
                <CiSearch
                  className="text-gray-500 cursor-pointer"
                  onClick={handleConfirmPlacement}
                />
              </div>
              {formik.touched.placement && formik.errors.placement && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.placement}
                </p>
              )}
            </div>
            {placementNameDisplay && (
              <div className="flex flex-col w-full">
                <label
                  htmlFor="placementFullName"
                  className="text-xs font-medium text-gray-700 mb-1"
                >
                  Placement Full Name
                </label>
                <p className={`text-xs text-gray-600 mt-1 ${placementConfirmed ? "" : "text-red-500"}`}>
                  {placementNameDisplay}
                </p>
              </div>
            )}
          </div>

          <div className="flex-[2] w-full flex flex-col gap-3">
            <p className="text-sm md:text-lg">Position</p>
            <div className="flex w-full gap-6 ustify-between">
              <button
                type="button"
                className={`px-8 py-2 rounded-full ${formik.values.position === "Left"
                  ? "bg-secondary text-white"
                  : "bg-white border border-black/50 text-black"
                  }`}
                onClick={() => formik.setFieldValue("position", "Left")}
              >
                Left
              </button>
              <button
                type="button"
                className={`px-8 py-2 rounded-full ${formik.values.position === "Right"
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

      <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Pick Your Package</p>
        {loadingPlans ? (
          <p className="text-center text-gray-500">Loading packages...</p>
        ) : packages.length > 0 ? (
          <div className="w-full overflow-x-auto styled-scrollbar mt-8 pb-4">
            <div className="flex gap-6 min-w-max">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id || index}
                  className={`w-[270px] md:w-[300px] border border-black/10 flex flex-col rounded-2xl cursor-pointer ${selectedPackage === pkg.id ? "border-primary" : ""}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <div className={`w-full h-18 rounded-t-2xl flex items-center justify-center text-white text-center ${index % 2 === 0 ? "bg-primary" : "bg-secondary"}`}>
                    <p className="text-xl md:text-2xl font-bold capitalize">{pkg.name} package</p>
                  </div>
                  <div className="py-6 flex flex-col gap-4 items-center justify-center">
                    <p className="text-3xl md:text-4xl font-bold">
                      {pkg.price}
                      <span className="text-sm font-light text-black/50">
                        NGN
                      </span>
                    </p>
                    <p className="text-black/70 text-[12px]">
                      Point Value: {pkg.point_value || pkg.pointValue} pv
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
      </form>
    </div>
  );
});

export default Step1;