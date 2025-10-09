import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import api from "../../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";

const Step4 = forwardRef(({ prevStep, nextStep, formData = {}, updateFormData }, ref) => {
  const { token } = useUser();
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSessionId, setLastSessionId] = useState(null);

  // Memoized fetchOverview function
  const fetchOverview = useCallback(async () => {
    if (!formData.session_id || formData.session_id === lastSessionId) {
      console.log("Skipping fetch: No session_id or same session_id", formData.session_id);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Fetching overview data with session_id:", formData.session_id);

    try {
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await api.get("/api/registration/overview", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Session-ID": formData.session_id,
        },
      });

      if (response.data.success) {
        console.log("Successfully fetched overview data:");
        console.log(JSON.stringify(response.data, null, 2));
        setOverviewData(response.data.data);
        updateFormData({
          ...response.data.data["0"].step_1,
          ...response.data.data["0"].step_2,
          ...response.data.data["0"].step_3,
          session_id: formData.session_id,
        });
        setLastSessionId(formData.session_id);
        console.log("Fetch complete, updated lastSessionId:", formData.session_id);
      } else {
        throw new Error(response.data.message || "Failed to fetch overview data");
      }
    } catch (error) {
      console.error("Error fetching overview:", error);
      setError(error.message || "Failed to load registration overview. Please try again.");
      toast.error(error.message || "Failed to load registration overview.");
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  }, [token, formData.session_id, lastSessionId, updateFormData]);

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Step4 mounted, initiating fetchOverview");
    fetchOverview();
  }, [fetchOverview]);

  // Expose a submit method for consistency
  useImperativeHandle(ref, () => ({
    submit: () => {
      console.log("Step4: Navigating to next step");
      nextStep();
    },
  }));

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  // Helper function to get sponsor/placement full name
  const getFullName = (userObj) => {
    if (!userObj) return "Not provided";
    return `${userObj.first_name || ""} ${userObj.last_name || ""}`.trim() || userObj.username || "Not provided";
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (!price) return "Not provided";
    return `${parseFloat(price).toLocaleString()} NGN`;
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
      <div className="bg-white border border-black/10 w-full h-full flex flex-col justify-between gap-6 p-4 md:p-8 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Registration Overview</p>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-y-8">
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Package</p>
            <p className="font-semibold">{overviewData?.plan?.name || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Sponsor</p>
            <p className="font-semibold">{getFullName(overviewData?.sponsor)}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">PV</p>
            <p className="font-semibold">{overviewData?.plan?.point_value || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Leg</p>
            <p className="font-semibold">{overviewData?.leg || overviewData?.["0"]?.step_1?.leg || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Placement</p>
            <p className="font-semibold">{getFullName(overviewData?.placement)}</p>
          </div>
        </div>
        <div className="border border-black/10"></div>
        <div className="flex justify-end">
          <p className="text-xl md:text-2xl font-semibold">
            Total Amount <span>{formatPrice(overviewData?.plan?.price)}</span>
          </p>
        </div>
      </div>
      <div className="bg-white border border-black/10 w-full h-full flex flex-col justify-between gap-6 p-4 md:p-8 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Personal Information</p>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-y-8">
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">First Name</p>
            <p className="font-semibold">{overviewData?.["0"]?.step_2?.first_name || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Last Name</p>
            <p className="font-semibold">{overviewData?.["0"]?.step_2?.last_name || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Gender</p>
            <p className="font-semibold">{overviewData?.["0"]?.step_2?.gender || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Country</p>
            <p className="font-semibold">{overviewData?.["0"]?.step_2?.country || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">State</p>
            <p className="font-semibold">{overviewData?.["0"]?.step_2?.state || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">City</p>
            <p className="font-semibold">{overviewData?.["0"]?.step_2?.city || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Email</p>
            <p className="font-semibold break-words whitespace-normal">
              {overviewData?.["0"]?.step_2?.email || "Not provided"}
            </p>
          </div>


          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Number</p>
            <p className="font-semibold">{overviewData?.["0"]?.step_2?.mobile || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Date of Birth</p>
            <p className="font-semibold">{overviewData?.["0"]?.step_2?.date_of_birth || "Not provided"}</p>
          </div>
        </div>
      </div>
      <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Login Information</p>
        <div className="w-full flex justify-between">
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Username</p>
            <p className="font-semibold">{overviewData?.["0"]?.step_3?.username || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <p className="font-medium">Password</p>
            <p className="font-semibold">{overviewData?.["0"]?.step_3?.password || "Not provided"}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Step4;