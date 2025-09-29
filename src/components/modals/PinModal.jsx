import React, { useState } from "react";
import { toast } from "sonner";

const PinModal = ({ onClose, onConfirm }) => {
  const [pin, setPin] = useState(["", "", "", ""]);


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

  const handleConfirm = () => {
    const pinValue = pin.join("");
    if (pinValue.length === 4) {
      sessionStorage.setItem("currentAuth", pinValue)
      onConfirm()
      setPin(["", "", "", ""]);
    } else {
      toast.error("Please enter a 4-digit PIN");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[90%] max-w-sm rounded-2xl shadow-xl p-6 relative animate-fadeIn">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Enter Your PIN
        </h2>

        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-input-${index}`}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/80"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
