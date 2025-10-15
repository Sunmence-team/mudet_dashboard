import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import { CiSearch } from "react-icons/ci";
import { Lock } from "lucide-react";
import { useDebounce } from "use-debounce";

const Step1 = forwardRef(({ prevStep, nextStep, formData = {}, updateFormData, setFormValidity, setSubmitting }, ref) => {
  const { token, user } = useUser();
  const backUpUser = JSON.parse(localStorage.getItem("user"));
  const walletBalance = parseFloat(user?.e_wallet || backUpUser?.e_wallet);

  const [packages, setPackages] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(formData.plan || null);
  const [sponsorNameDisplay, setSponsorNameDisplay] = useState("");
  const [sponsorConfirmed, setSponsorConfirmed] = useState(false);
  const [sponsorId, setSponsorId] = useState(null);
  const [sponsorSuggestions, setSponsorSuggestions] = useState([]);
  const [validatingSponsor, setValidatingSponsor] = useState(false);
  const [placementNameDisplay, setPlacementNameDisplay] = useState("");
  const [placementConfirmed, setPlacementConfirmed] = useState(false);
  const [placementId, setPlacementId] = useState(null);
  const [placementSuggestions, setPlacementSuggestions] = useState([]);
  const [validatingPlacement, setValidatingPlacement] = useState(false);
  const [availableLegs, setAvailableLegs] = useState([]);
  const [showSponsorDropdown, setShowSponsorDropdown] = useState(false);
  const [showPlacementDropdown, setShowPlacementDropdown] = useState(false);

  const sponsorInputRef = useRef(null);
  const placementInputRef = useRef(null);

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
        console.log("Submitting payload:", JSON.stringify(payload, null, 2));

        const response = await api.post("/api/registration/step-1", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        console.log("Step 1 submission response:", JSON.stringify(response.data, null, 2));

        if (response.data.success) {
          toast.success(response.data.message || "Step 1 completed successfully");
          const newFormData = {
            ...response.data.data,
            session_id: response.data.session_id,
          };
          console.log("Updating formData:", JSON.stringify(newFormData, null, 2));
          updateFormData(newFormData);
          setSubmitting(false);
          setTimeout(() => {
            console.log("Calling nextStep to move to Step 2");
            // nextStep();
          }, 300);
          return true;
        } else {
          console.error("Step 1 failed:", response.data.message);
          toast.error(response.data.message || "Step 1 submission failed");
          setSubmitting(false);
          return false;
        }
      } catch (error) {
        console.error("Error during Step 1 submission:", error);
        if (error.response?.data?.message?.includes("unauthenticated")) {
          // logout();
        }
        toast.error(error.response?.data?.message || error.message || "Error submitting");
        setSubmitting(false);
        return false;
      }
    },
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      try {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
          console.log("Validation errors in Step 1:", errors);
          setSubmitting(false);
          return false;
        }
        const result = await formik.submitForm();
        return result; // Return the result of onSubmit (true/false)
      } catch (error) {
        console.error("Submit failed in Step 1:", error);
        setSubmitting(false);
        return false;
      }
    },
  }));

  // Debounce sponsor and placement inputs
  const [debouncedSponsor] = useDebounce(formik.values.sponsor, 500);
  const [debouncedPlacement] = useDebounce(formik.values.placement, 500);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sponsorInputRef.current && !sponsorInputRef.current.contains(event.target)) {
        setShowSponsorDropdown(false);
      }
      if (placementInputRef.current && !placementInputRef.current.contains(event.target)) {
        setShowPlacementDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch sponsor suggestions
  useEffect(() => {
    const fetchSponsorSuggestions = async () => {
      if (!debouncedSponsor || sponsorConfirmed) return;
      setValidatingSponsor(true);
      try {
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          setSponsorSuggestions([]);
          return;
        }
        const response = await api.get("/api/referrals/downlines", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          params: { search: debouncedSponsor },
        });
        console.log("Sponsor suggestions response:", JSON.stringify(response.data, null, 2));
        const suggestions = Array.isArray(response.data.data?.downlines)
          ? response.data.data.downlines.map((item) => ({
              id: item.user.id,
              username: item.user.username,
              first_name: item.user.fullname.split(" ")[0] || "",
              last_name: item.user.fullname.split(" ").slice(1).join(" ") || "",
            }))
          : [];
       
        setSponsorSuggestions(suggestions);
        setShowSponsorDropdown(suggestions.length > 0);
      } catch (error) {
        console.error("Error fetching sponsor suggestions:", error);
        if (error.response?.data?.message?.includes("unauthenticated")) {
          // logout();
        }
        toast.error(error.response?.data?.message || "Failed to fetch sponsor suggestions");
        setSponsorSuggestions([]);
      } finally {
        setValidatingSponsor(false);
      }
    };
    fetchSponsorSuggestions();
  }, [debouncedSponsor, token, sponsorConfirmed, user?.id]);

  // Fetch placement suggestions
  useEffect(() => {
    const fetchPlacementSuggestions = async () => {
      if (!debouncedPlacement || !sponsorId || placementConfirmed) {
        console.log("Skipping placement fetch: ", { debouncedPlacement, sponsorId, placementConfirmed });
        return;
      }
      setValidatingPlacement(true);
      try {
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          setPlacementSuggestions([]);
          return;
        }
        const response = await api.get(`/api/referrals/downlines/${sponsorId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          params: { search: debouncedPlacement },
        });
        console.log("Placement suggestions response:", JSON.stringify(response.data, null, 2));
        const suggestions = Array.isArray(response.data.data?.downlines)
          ? response.data.data.downlines.map((item) => ({
              id: item.user.id,
              username: item.user.username,
              first_name: item.user.fullname.split(" ")[0] || "",
              last_name: item.user.fullname.split(" ").slice(1).join(" ") || "",
            }))
          : [];
        setPlacementSuggestions(suggestions);
        setShowPlacementDropdown(suggestions.length > 0);
      } catch (error) {
        console.error("Error fetching placement suggestions:", error);
        if (error.response?.data?.message?.includes("unauthenticated")) {
          // logout();
        }
        toast.error(error.response?.data?.message || "Failed to fetch placement suggestions");
        setPlacementSuggestions([]);
      } finally {
        setValidatingPlacement(false);
      }
    };
    fetchPlacementSuggestions();
  }, [debouncedPlacement, sponsorId, token, placementConfirmed]);

  // Fetch available legs
  useEffect(() => {
    const fetchAvailableLegs = async () => {
      if (!placementId) return;
      setValidatingPlacement(true);
      try {
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          setAvailableLegs(["left", "right"]);
          return;
        }
        const response = await api.get(`/api/referrals/available-legs?placement_id=${placementId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        console.log("Available legs response:", JSON.stringify(response.data, null, 2));
        const legs = Array.isArray(response.data.data?.available_legs) ? response.data.data.available_legs : ["left", "right"];
        setAvailableLegs(legs);
        if (formik.values.position && !legs.includes(formik.values.position.toLowerCase())) {
          formik.setFieldValue("position", "");
        }
      } catch (error) {
        console.error("Error fetching available legs:", error);
        if (error.response?.data?.message?.includes("unauthenticated")) {
          // logout();
        }
        toast.error(error.response?.data?.message || "Failed to fetch available legs");
        setAvailableLegs(["left", "right"]);
      } finally {
        setValidatingPlacement(false);
      }
    };
    fetchAvailableLegs();
  }, [placementId, token]);

  const handleSponsorSelect = (suggestion) => {
    formik.setFieldValue("sponsor", suggestion.username);
    setSponsorNameDisplay(`${suggestion.first_name} ${suggestion.last_name}`);
    setSponsorId(suggestion.id);
    setSponsorConfirmed(true);
    setSponsorSuggestions([]);
    setShowSponsorDropdown(false);
    // Reset placement when sponsor changes
    formik.setFieldValue("placement", "");
    setPlacementNameDisplay("");
    setPlacementId(null);
    setPlacementConfirmed(false);
    setPlacementSuggestions([]);
    setShowPlacementDropdown(false);
    setAvailableLegs([]);
    formik.setFieldValue("position", "");
  };

  const handlePlacementSelect = (suggestion) => {
    formik.setFieldValue("placement", suggestion.username);
    setPlacementNameDisplay(`${suggestion.first_name} ${suggestion.last_name}`);
    setPlacementId(suggestion.id);
    setPlacementConfirmed(true);
    setPlacementSuggestions([]);
    setShowPlacementDropdown(false);
  };

  const handleConfirmSponsor = () => {
    if (formik.values.sponsor) {
      if (!Array.isArray(sponsorSuggestions)) {
        toast.error("Sponsor suggestions not loaded. Please try typing again.");
        return;
      }
      const suggestion = sponsorSuggestions.find((s) => s.username === formik.values.sponsor);
      if (suggestion) {
        handleSponsorSelect(suggestion);
      } else {
        toast.error("Please select a valid sponsor from the suggestions");
      }
    } else {
      toast.error("Please enter a sponsor username");
    }
  };

  const handleConfirmPlacement = () => {
    if (formik.values.placement) {
      if (!Array.isArray(placementSuggestions)) {
        toast.error("Placement suggestions not loaded. Please try typing again.");
        return;
      }
      const suggestion = placementSuggestions.find((s) => s.username === formik.values.placement);
      if (suggestion) {
        handlePlacementSelect(suggestion);
      } else {
        toast.error("Please select a valid placement from the suggestions");
      }
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
            Accept: "application/json",
          },
        });
        console.log("Plans fetched successfully:", JSON.stringify(response.data, null, 2));
        const sortedPackages = (Array.isArray(response.data.data?.data) ? response.data.data.data : []).reverse();
        setPackages(sortedPackages);
      } catch (error) {
        console.error("Error fetching plans:", error);
        if (error.response?.data?.message?.includes("unauthenticated")) {
          // logout();
        }
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
        <div className="w-full flex flex-col md:flex-row gap-14">
          <div className="flex-[4] w-full flex flex-col gap-3 relative" ref={sponsorInputRef}>
            <p className="text-sm md:text-lg">Sponsor</p>
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
                    const value = e.target.value.replace(/^@/, "");
                    formik.setFieldValue("sponsor", value);
                    setSponsorConfirmed(false);
                    setSponsorNameDisplay("");
                    setSponsorId(null);
                    setShowSponsorDropdown(true);
                  }}
                  onBlur={formik.handleBlur}
                />
                <CiSearch
                  className={`text-gray-500 ${validatingSponsor ? "animate-spin" : "cursor-pointer"}`}
                  onClick={handleConfirmSponsor}
                />
              </div>
              {formik.touched.sponsor && formik.errors.sponsor && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.sponsor}</p>
              )}
              {validatingSponsor && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
            </div>
            {showSponsorDropdown && sponsorSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-sm mt-2 max-h-48 overflow-y-auto z-10">
                {sponsorSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSponsorSelect(suggestion)}
                  >
                    @{suggestion.username} ({suggestion.first_name} {suggestion.last_name})
                  </div>
                ))}
              </div>
            )}
            {sponsorNameDisplay && (
              <div className="flex flex-col w-full">
                <label htmlFor="sponsorFullName" className="text-xs font-medium text-gray-700 mb-1">
                  Sponsor Full Name
                </label>
                <p className={`text-xs text-gray-600 mt-1 ${sponsorConfirmed ? "" : "text-red-500"}`}>
                  {sponsorNameDisplay}
                </p>
              </div>
            )}
          </div>

          <div className="flex-[4] w-full flex flex-col gap-3 relative" ref={placementInputRef}>
            <p className="text-sm md:text-lg">Placement</p>
            <div className="w-full mx-auto">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder={sponsorId ? "Search for a placement" : "Enter sponsor first"}
                  className="flex-1 outline-none bg-transparent"
                  id="placement"
                  name="placement"
                  value={formik.values.placement}
                  onChange={(e) => {
                    const value = e.target.value.replace(/^@/, "");
                    formik.setFieldValue("placement", value);
                    setPlacementConfirmed(false);
                    setPlacementNameDisplay("");
                    setPlacementId(null);
                    setShowPlacementDropdown(true);
                  }}
                  onBlur={formik.handleBlur}
                  disabled={!sponsorId}
                />
                <CiSearch
                  className={`text-gray-500 ${validatingPlacement ? "animate-spin" : "cursor-pointer"}`}
                  onClick={handleConfirmPlacement}
                />
              </div>
              {formik.touched.placement && formik.errors.placement && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.placement}</p>
              )}
              {validatingPlacement && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
            </div>
            {showPlacementDropdown && placementSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-sm mt-2 max-h-48 overflow-y-auto z-10">
                {placementSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePlacementSelect(suggestion)}
                  >
                    @{suggestion.username} ({suggestion.first_name} {suggestion.last_name})
                  </div>
                ))}
              </div>
            )}
            {placementNameDisplay && (
              <div className="flex flex-col w-full">
                <label htmlFor="placementFullName" className="text-xs font-medium text-gray-700 mb-1">
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
            <div className="flex w-full justify-between">
              <button
                type="button"
                className={`px-8 py-2 rounded-full ${
                  formik.values.position === "Left" ? "bg-secondary text-white" : "bg-white border border-black/50 text-black"
                } ${!availableLegs.includes("left") ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (availableLegs.includes("left")) {
                    formik.setFieldValue("position", "Left");
                  } else {
                    toast.error("Left position is not available");
                  }
                }}
                disabled={!availableLegs.includes("left") || !sponsorId || !placementId}
              >
                Left
              </button>
              <button
                type="button"
                className={`px-8 py-2 rounded-full ${
                  formik.values.position === "Right" ? "bg-secondary text-white" : "bg-white border border-black/50 text-black"
                } ${!availableLegs.includes("right") ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (availableLegs.includes("right")) {
                    formik.setFieldValue("position", "Right");
                  } else {
                    toast.error("Right position is not available");
                  }
                }}
                disabled={!availableLegs.includes("right") || !sponsorId || !placementId}
              >
                Right
              </button>
            </div>
            {formik.touched.position && formik.errors.position && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.position}</p>
            )}
            {availableLegs.length === 0 && placementId && !validatingPlacement && (
              <p className="text-red-500 text-xs mt-1">No available positions for this placement.</p>
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
              {packages.map((pkg, index) => {
                const isLockedByFunds = +pkg.price > walletBalance;
                return (
                  <div
                    key={pkg.id || index}
                    className={`w-[270px] md:w-[300px] relative border border-black/10 flex flex-col rounded-2xl cursor-pointer ${
                      selectedPackage === pkg.id ? "border-primary" : ""
                    }`}
                    onClick={() => {
                      if (isLockedByFunds) {
                        toast.info("Insufficient funds to select this package");
                      } else {
                        setSelectedPackage(pkg.id);
                      }
                    }}
                  >
                    <div
                      className={`w-full h-18 rounded-t-2xl flex items-center justify-center text-white text-center ${
                        index % 2 === 0 ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      <p className="text-xl md:text-2xl font-bold capitalize">{pkg.name} package</p>
                    </div>
                    <div className="py-6 flex flex-col gap-4 items-center justify-center">
                      <p className="text-3xl md:text-4xl font-bold">
                        {pkg.price}
                        <span className="text-sm font-light text-black/50">NGN</span>
                      </p>
                      <p className="text-black/70 text-[12px]">
                        Point Value: {pkg.point_value || pkg.pointValue} pv
                      </p>
                      {isLockedByFunds && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-xs bg-black/40 rounded-2xl z-10">
                          <Lock className="text-white w-10 h-10 mb-2 animate-pulse" />
                          <p className="text-white font-semibold text-lg">Locked</p>
                          <p className="text-white font-semibold text-sm text-center">Insufficient Funds</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No packages available</p>
        )}
      </div>

      <form onSubmit={formik.handleSubmit}></form>
    </div>
  );
});

export default Step1;