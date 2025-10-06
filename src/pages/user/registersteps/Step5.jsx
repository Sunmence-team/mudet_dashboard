import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import api from "../../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";

const Step5 = forwardRef(({ nextStep, formData = {}, updateFormData, setSubmitting }, ref) => {
  const { token } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [reference, setReference] = useState(null);
  const [lastSessionId, setLastSessionId] = useState(null);

  // Memoized completeRegistration function
  const completeRegistration = useCallback(async () => {
    if (!formData.session_id || formData.session_id === lastSessionId) {
      console.log("Skipping completion: No session_id or already completed", formData.session_id);
      setLoading(false);
      if (formData.registration_completed) {
        setCompleted(true);
        toast.success(formData.message || "Account created and enabled successfully");
      }
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Completing registration with session_id:", formData.session_id);

    try {
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await api.post("/api/registration/complete", {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Session-ID": formData.session_id,
        },
      });

      console.log("Successfully completed registration:");
      console.log(JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        setReference(response.data.reference);
        setCompleted(true);
        toast.success(response.data.message || "Account created and enabled successfully");
        updateFormData({
          ...formData,
          registration_completed: true,
          reference: response.data.reference,
          message: response.data.message,
        });
        setLastSessionId(formData.session_id);
        console.log("Completion complete, updated lastSessionId:", formData.session_id);
        if (setSubmitting) setSubmitting(false);
      } else {
        throw new Error(response.data.message || "Failed to complete registration");
      }
    } catch (error) {
      console.error("Error completing registration:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to complete registration.";
      setError(errorMessage);
      toast.error(errorMessage);

      // Handle 409 as success if response indicates completion
      if (error.response?.status === 409 && error.response?.data?.success) {
        setReference(error.response.data.reference);
        setCompleted(true);
        toast.success(error.response.data.message || "Account created and enabled successfully");
        updateFormData({
          ...formData,
          registration_completed: true,
          reference: error.response.data.reference,
          message: error.response.data.message,
        });
        setLastSessionId(formData.session_id);
        console.log("Completion complete (409 handled), updated lastSessionId:", formData.session_id);
      }
      if (setSubmitting) setSubmitting(false);
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  }, [token, formData.session_id, formData.registration_completed, formData.message, lastSessionId, updateFormData, setSubmitting]);

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Step5 mounted, initiating completeRegistration");
    completeRegistration();
  }, [completeRegistration]);

  // Expose a submit method for consistency
  useImperativeHandle(ref, () => ({
    submit: () => {
      console.log("Step5: Manually triggering completion");
      completeRegistration();
    },
  }));

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center mt-12">
        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
        </svg>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="w-full flex items-center justify-center mt-12">
        <div className="bg-white border border-black/10 rounded-lg p-8 md:p-16 w-full max-w-xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-green-600 mb-4">Registration Successful</h2>
          <p className="text-lg md:text-xl text-gray-600">Your account has been created and enabled successfully.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center mt-12">
        <div className="bg-white border border-black/10 rounded-lg p-8 md:p-16 w-full max-w-xl text-center">
          <p className="text-red-500 text-lg md:text-xl">{error}</p>
        </div>
      </div>
    );
  }

  // Fallback UI (rare case)
  return (
    <div className="w-full flex items-center justify-center mt-12">
      <div className="bg-white border border-black/10 rounded-lg p-8 md:p-16 w-full max-w-xl text-center">
        <p className="text-lg md:text-xl text-gray-600">Preparing to complete registration...</p>
      </div>
    </div>
  );
});

export default Step5;