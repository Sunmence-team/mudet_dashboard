import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const PinModal = ({ onClose, onConfirm, user }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [incorrectPin, setIncorrectPin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        document.getElementById(`pin-input-${index + 1}`).focus();
      }
    }
  };

  const handleConfirm = async () => {
    try {
      const pinValue = pin.join("");
      if (pinValue.length === 4) {
        // localStorage.setItem("currentAuth", pinValue);
        if (pinValue) {
          setSubmitting(true);
        }
        await onConfirm(pinValue); // ✅ pass the pin to parent;
      } else {
        toast.error("Please enter a 4-digit PIN");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      setPin(["", "", "", ""]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[90%] max-w-sm rounded-2xl shadow-xl p-6 relative animate-fadeIn">
        <div className="flex flex-col items-center gap-2 mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Enter Your PIN
          </h2>
          <p className="text-sm font-semibold text-gray-400 text-center">
            Enter your 4 digit pin to authenticate your request
          </p>
        </div>
        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-input-${index}`}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className={`w-12 h-12 text-center text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                incorrectPin ? "border-red-600 border" : "border"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={()=> onClose(pin)}
            className="flex w-1/2 items-center justify-center bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex w-1/2 items-center justify-center bg-primary text-white py-2 rounded-lg hover:bg-primary/80"
            disabled={submitting}
          >
            {!submitting ? (
              <span>Confirm</span>
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
