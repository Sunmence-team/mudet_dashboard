import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CiSearch } from "react-icons/ci";
import api from "../../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";



const Step1 = forwardRef(
  (
    { prevStep, nextStep, formData = {}, updateFormData, setFormValidity },
    ref
  ) => {
    const { token } = useUser();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    // 🔥 State for plans
    const [packages, setPackages] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(false);

    const [selectedPackage, setSelectedPackage] = useState(
      formData.plan || null
    );

    // States for sponsor validation
    const [sponsorNameDisplay, setSponsorNameDisplay] = useState("");
    const [sponsorConfirmed, setSponsorConfirmed] = useState(false);
    const [sponsorId, setSponsorId] = useState(null);
    const [validatingSponsor, setValidatingSponsor] = useState(false);

    // States for placement validation
    const [placementNameDisplay, setPlacementNameDisplay] = useState("");
    const [placementConfirmed, setPlacementConfirmed] = useState(false);
    const [placementId, setPlacementId] = useState(null);
    const [validatingPlacement, setValidatingPlacement] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    // ✅ Validation
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
      onSubmit: async (values) => {
        if (!sponsorConfirmed) {
          toast.error("Please validate the sponsor username");
          return;
        }
        if (!placementConfirmed) {
          toast.error("Please validate the placement username");
          return;
        }
        if (!selectedPackage) {
          toast.error("Please select a package");
          return;
        }

        setSubmitting(true);
        try {
          if (!token) {
            toast.error("No authentication token found. Please log in.");
            return;
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
          } else {
            console.error("Step 1 failed:", response.data.message);
            toast.error(response.data.message || "Step 1 submission failed");
          }
        } catch (error) {
          console.error("Error during Step 1 submission:", error);
          if (error.response?.data?.errors) {
            const errorMessages = Object.values(error.response.data.errors)
              .flat()
              .join("; ");
            toast.error(
              errorMessages ||
                error.response?.data?.message ||
                "An error occurred during Step 1 submission"
            );
          } else {
            toast.error(
              error.response?.data?.message ||
                error.message ||
                "An error occurred during Step 1 submission"
            );
          }
        } finally {
          setSubmitting(false);
        }
      },
    });

    useImperativeHandle(ref, () => ({
      submit: formik.submitForm,
    }));

    // Function to validate sponsor's username using POST /api/validate-username
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

        const response = await api.post(
          "/api/validate-username",
          { username },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          response.data.message === "Username validated successfully" &&
          response.data.data
        ) {
          setSponsorNameDisplay(
            `${response.data.data.first_name} ${response.data.data.last_name}`
          );
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
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Error validating sponsor username"
        );
      } finally {
        setValidatingSponsor(false);
      }
    };

    // Function to validate placement's username using POST /api/validate-username
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

        const response = await api.post(
          "/api/validate-username",
          { username },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          response.data.message === "Username validated successfully" &&
          response.data.data
        ) {
          setPlacementNameDisplay(
            `${response.data.data.first_name} ${response.data.data.last_name}`
          );
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
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Error validating placement username"
        );
      } finally {
        setValidatingPlacement(false);
      }
    };

    // Handle confirm sponsor (triggered by search icon)
    const handleConfirmSponsor = () => {
      if (formik.values.sponsor) {
        fetchSponsor(formik.values.sponsor);
      } else {
        toast.error("Please enter a sponsor username");
      }
    };

    // Handle confirm placement (triggered by search icon)
    const handleConfirmPlacement = () => {
      if (formik.values.placement) {
        fetchPlacement(formik.values.placement);
      } else {
        toast.error("Please enter a placement username");
      }
    };

    // ✅ Fetch plans dynamically
    useEffect(() => {
      const fetchPlans = async () => {
        setLoadingPlans(true);
        try {
          if (!token) {
            toast.error("No authentication token found. Please log in.");
            return;
          }
          const response = await api.get("/api/plans/all", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Plans fetched successfully:", response.data); // Debug log
          setPackages(response.data.data.data || []); // Adjust path if needed based on actual response structure
        } catch (error) {
          console.error("Error fetching plans:", error);
          toast.error("Failed to load plans.");
        } finally {
          setLoadingPlans(false);
        }
      };

      fetchPlans();
    }, [token]);

    // ✅ Update form validity dynamically
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
      setFormValidity(
        formik.isValid &&
          formik.dirty &&
          selectedPackage !== null &&
          sponsorConfirmed &&
          placementConfirmed
      );
    }, [
      formik.isValid,
      formik.dirty,
      selectedPackage,
      sponsorConfirmed,
      placementConfirmed,
      setFormValidity,
    ]);

    return (
      <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
        {/* Sponsor / Placement / Position */}
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
                  <p
                    className={`text-xs text-gray-600 mt-1 ${
                      sponsorConfirmed ? "" : "text-red-500"
                    }`}
                  >
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
                  <p
                    className={`text-xs text-gray-600 mt-1 ${
                      placementConfirmed ? "" : "text-red-500"
                    }`}
                  >
                    {placementNameDisplay}
                  </p>
                </div>
              )}
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
                      selectedPackage === pkg.id ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <div className="w-full h-18 bg-primary rounded-t-2xl flex items-center justify-center text-white text-center">
                      <p className="text-xl md:text-2xl font-bold">
                        {pkg.name}
                      </p>
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
          {/* No hidden button needed */}
        </form>
      </div>
    );
  }
);

export default Step1;
