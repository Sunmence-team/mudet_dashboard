import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import api from "../../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import PinModal from "../../../components/modals/PinModal";

const Step5 = forwardRef(({ nextStep, formData = {}, updateFormData, setSubmitting }, ref) => {
  const { token, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [reference, setReference] = useState(null);
  const [lastSessionId, setLastSessionId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [pinModal, setPinModal] = useState(false);

  // Memoized completeRegistration function
  const completeRegistration = useCallback(async (pin = null) => {
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

      const response = await api.post("/api/registration/complete", { pin }, {
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
  }, [token, formData, lastSessionId, updateFormData, setSubmitting]);

  // Handle Proceed button click
  const handleProceed = useCallback(() => {
    const transactionPin = localStorage.getItem("currentAuth");
    if (!transactionPin) {
      setPinModal(true);
      return;
    }
    completeRegistration(transactionPin);
    localStorage.removeItem("currentAuth");
  }, [completeRegistration]);

  // Handle PIN confirmation
  const handlePinConfirm = useCallback((pin) => {
    localStorage.setItem("currentAuth", pin);
    setPinModal(false);
    completeRegistration(pin);
  }, [completeRegistration]);

  // Handle PIN modal decline
  const handlePinDecline = useCallback(() => {
    localStorage.removeItem("currentAuth");
    setPinModal(false);
  }, []);

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return "Not provided";
    return `${parseFloat(price).toLocaleString()} NGN`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Step5 mounted");
    // Do not automatically trigger completeRegistration
  }, []);

  // Expose a submit method for consistency
  useImperativeHandle(ref, () => ({
    submit: () => {
      console.log("Step5: Manually triggering confirmation");
      setShowConfirmation(true);
    },
  }));
  console.log("Step5 formData:", formData);


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
          {reference && (
            <p className="text-sm md:text-base text-gray-500 mt-2">Reference: {reference}</p>
          )}
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

  if (showConfirmation) {
    return (
      <div className="w-full flex items-center justify-center mt-12">
        <div className="bg-white border border-black/10 rounded-lg p-8 md:p-16 w-full max-w-xl text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Confirm Payment</h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            You need to enter your transaction PIN to complete the registration and enable your account.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowConfirmation(false)}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition"
            >
              Proceed
            </button>
          </div>
        </div>
        {pinModal && (
          <PinModal
            onClose={handlePinDecline}
            onConfirm={handlePinConfirm}
            user={user}
          />
        )}
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