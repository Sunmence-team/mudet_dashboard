import React, { useEffect, useState } from "react";
import OverviewCard from "../../components/cards/OverviewCard";
import { useFormik } from "formik";
import PinModal from "../../components/modals/PinModal";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import api from "../../utilities/api";

const EwalletTransfer = () => {
  const { token, user } = useUser();
  const [activeUser, setActiveUser] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false); // Track validation loading
  const [pinModal, setPinModal] = useState(false);
  const [pinSubmitting, setPinSubmitting] = useState(false); // Track PIN submission
  const [recipientNameDisplay, setRecipientNameDisplay] = useState("");
  const [recipientConfirmed, setRecipientConfirmed] = useState(false);
  const [receiverId, setReceiverId] = useState(null); // Store receiver_id from validate-username response
  const [buttonClicked, setButtonClicked] = useState(false); // Track Confirm Transfer button click

  useEffect(() => {
    // Use user from context if available, else fall back to localStorage
    setActiveUser(user || JSON.parse(localStorage.getItem("user") || "{}"));
  }, [user]);

  // Function to validate recipient's username using POST /api/validate-username
  const fetchRecipientName = async (recipientName) => {
    try {
      setValidating(true); // Start validation loading
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        setRecipientNameDisplay("Authentication required");
        setRecipientConfirmed(false);
        setReceiverId(null);
        return;
      }

      const response = await api.post(
        "/api/validate-username",
        { username: recipientName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Validate username response:", response);

      if (
        response.data.message === "Username validated successfully" &&
        response.data.data
      ) {
        setRecipientNameDisplay(
          `${response.data.data.first_name} ${response.data.data.last_name}`
        );
        setRecipientConfirmed(true);
        setReceiverId(response.data.data.id); // Store receiver_id
        toast.success("Username validated successfully");
      } else {
        setRecipientNameDisplay("User not found");
        setRecipientConfirmed(false);
        setReceiverId(null);
        toast.error(response.data.message || "Invalid username");
      }
    } catch (error) {
      console.error("Error validating recipient:", error);
      setRecipientNameDisplay("Error validating user");
      setRecipientConfirmed(false);
      setReceiverId(null);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error validating username"
      );
    } finally {
      setValidating(false); // Stop validation loading
    }
  };

  // Handle confirm recipient button
  const handleConfirmRecipient = () => {
    if (formik.values.recipientName) {
      fetchRecipientName(formik.values.recipientName);
    } else {
      toast.error("Please enter a recipient username");
    }
  };

  // Handle API call for transfer using POST /api/p2p
  const handleTransfer = async (pin) => {
    try {
      setSubmitting(true);
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      if (!receiverId) {
        toast.error("Recipient not validated. Please validate the username.");
        return;
      }

      if (!activeUser.id) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      if (!pin || pin.trim() === "") {
        toast.error("Please enter a valid transaction PIN.");
        return;
      }

      console.log("Transfer payload:", {
        user_id: activeUser.id,
        receiver_id: receiverId,
        wallet: "e_wallet",
        amount: formik.values.amount,
        pin: pin,
      });

      const response = await api.post(
        "/api/p2p",
        {
          user_id: activeUser.id,
          receiver_id: receiverId,
          wallet: "e_wallet",
          amount: formik.values.amount,
          pin: pin,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Transfer response:", response);

      if (
        response.data.ok &&
        response.data.message ===
          "e_wallet_transfer transfer completed successfully."
      ) {
        toast.success("Transfer completed successfully");
        setActiveUser((prev) => ({
          ...prev,
          e_wallet: response.data.data.sender.e_wallet,
        }));
        formik.resetForm();
        setRecipientNameDisplay("");
        setRecipientConfirmed(false);
        setReceiverId(null);
      } else {
        console.error("Transfer failed:", response.data.message);
        toast.error(response.data.message || "Transfer failed");
      }
    } catch (error) {
      console.error("Error during transfer:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join("; ");
        toast.error(
          errorMessages ||
            error.response?.data?.message ||
            "An error occurred during the transfer"
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "An error occurred during the transfer"
        );
      }
    } finally {
      setSubmitting(false);
      setButtonClicked(false); // Reset buttonClicked to allow new submission
      setPinSubmitting(false); // Stop PIN submission loading
    }
  };

  const handlePinConfirm = () => {
    const pin = localStorage.getItem("currentAuth");
    console.log("PIN received:", pin);
    setPinModal(false); // Close modal immediately
    setPinSubmitting(true); // Start PIN submission loading
    if (!pin || pin.trim() === "") {
      toast.error("Please enter a valid PIN in the modal.");
      setPinSubmitting(false);
      return;
    }
    // Optionally validate PIN against userPin from backend, similar to Deposit.jsx
    const userPin = activeUser?.pin;
    if (userPin && pin !== userPin) {
      toast.error("Incorrect PIN. Please try again.");
      setPinSubmitting(false);
      return;
    }
    handleTransfer(pin);
  };

  const onSubmit = () => {
    if (!recipientConfirmed) {
      handleConfirmRecipient();
      return;
    }
    setPinModal(true);
    setButtonClicked(true); // Mark button as clicked
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      recipientName: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.amount) errors.amount = "Required";
      else if (values.amount <= 0)
        errors.amount = "Amount must be greater than 0";
      if (!values.recipientName) errors.recipientName = "Required";
      return errors;
    },
    onSubmit: () => {
      onSubmit();
    },
  });

  const eWallet = [
    {
      type: "wallet",
      walletType: "E-Wallet",
      walletBalance: +activeUser.e_wallet || 0,
      path: "/admin/",
      pathName: "Fund Wallet",
      color: "deepGreen",
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-7">
        <h1 className="text-2xl font-semibold text-black">E-Wallet Transfer</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eWallet.map((wallet, index) => (
            <OverviewCard details={wallet} key={index} />
          ))}
        </div>
        <div className="w-full">
          <div className="w-full lg:mx-0 mx-auto">
            <form
              onSubmit={formik.handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
                <p className="text-xl md:text-2xl font-semibold">
                  Transfer Funds
                </p>

                <div className="flex flex-col w-full">
                  <label
                    htmlFor="amount"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Transfer Amount
                    {formik.touched.amount && formik.errors.amount && (
                      <span className="text-red-500 text-xs">
                        {" "}
                        - {formik.errors.amount}
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="Enter Transfer Amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-12 px-4 py-2 border w-full ${
                      formik.touched.amount && formik.errors.amount
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-pryClr focus:border-pryClr`}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label
                    htmlFor="recipientName"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Recipient Username
                    {formik.touched.recipientName &&
                      formik.errors.recipientName && (
                        <span className="text-red-500 text-xs">
                          {" "}
                          - {formik.errors.recipientName}
                        </span>
                      )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="recipientName"
                      name="recipientName"
                      placeholder="Enter Recipient Username"
                      value={formik.values.recipientName}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setRecipientConfirmed(false);
                        setRecipientNameDisplay("");
                        setReceiverId(null);
                      }}
                      onBlur={formik.handleBlur}
                      className={`h-12 px-4 py-2 border w-full ${
                        formik.touched.recipientName &&
                        formik.errors.recipientName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-pryClr focus:border-pryClr`}
                    />
                    <button
                      type="button"
                      onClick={handleConfirmRecipient}
                      disabled={
                        !formik.values.recipientName || submitting || validating
                      }
                      className="bg-primary text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                    >
                      {validating ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2 inline-block"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </>
                      ) : (
                        "Validate"
                      )}
                    </button>
                  </div>
                </div>

                {recipientNameDisplay && (
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="recipientFullName"
                      className="text-sm font-medium text-gray-700 mb-1"
                    >
                      Recipient Full Name
                    </label>
                    <input
                      type="text"
                      id="recipientFullName"
                      name="recipientFullName"
                      value={recipientNameDisplay}
                      disabled
                      className={`h-12 px-4 py-2 border w-full ${
                        recipientConfirmed
                          ? "border-gray-300"
                          : "border-red-500"
                      } rounded-lg bg-gray-100`}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !recipientConfirmed || buttonClicked}
                  className="bg-primary text-white px-6 py-2 rounded-full w-full sm:w-auto disabled:bg-gray-400"
                >
                  {submitting || pinSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Confirm Transfer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {pinModal && (
        <PinModal
          onClose={() => setPinModal(false)}
          onConfirm={handlePinConfirm}
          user={activeUser}
        />
      )}
    </>
  );
};

export default EwalletTransfer;
