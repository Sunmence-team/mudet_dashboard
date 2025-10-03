import { Loader2 } from "lucide-react";
import React from "react";

const WarningModal = ({
  title,
  message,
  positiveAction,
  negativeAction,
  isPositive,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={negativeAction}
            className="px-4 py-2 bg-primary/90 text-white rounded hover:bg-primary cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            onClick={positiveAction}
            className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition"
          >
            {isPositive ? <Loader2 className="animate-spin" /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
