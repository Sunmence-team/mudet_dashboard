import React, { useEffect, useState } from "react";
import OverviewCard from "../../components/cards/OverviewCard";
import { useFormik } from "formik";
import PinModal from "../../components/modals/PinModal";
import { toast } from "sonner";
import api from "../../utilities/api";
import { useUser } from "../../context/UserContext";

const EwalletTransfer = () => {
  const { token, user, refreshUser } = useUser();
  const [activeUser, setActiveUser] = useState({});
  const [validating, setValidating] = useState(false); // Track validation loading
  const [pinModal, setPinModal] = useState(false);
  const [recipientNameDisplay, setRecipientNameDisplay] = useState("");
  const [recipientConfirmed, setRecipientConfirmed] = useState(false);
  const [receiverId, setReceiverId] = useState(null); // Store receiver_id from validate-username response

  useEffect(() => {
    setActiveUser(user || JSON.parse(localStorage.getItem("user") || "{}"));
  }, [user]);

  // Validate recipient's username
  const fetchRecipientName = async (recipientName) => {
    try {
      setValidating(true);
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
        setReceiverId(response.data.data.id);
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
      setValidating(false);
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

  const onSubmit = async (transactionPin) => {
    if (!recipientConfirmed) {
      handleConfirmRecipient();
      return;
    }
    if (!transactionPin) {
      setPinModal(true);
      return;
    }
    try {
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      if (!receiverId) {
        throw new Error(
          "Recipient not validated. Please validate the username."
        );
      }

      if (!activeUser.id) {
        throw new Error("User ID not found. Please log in again.");
      }

      console.log("Transfer payload:", {
        user_id: activeUser.id,
        receiver_id: receiverId,
        wallet: "e_wallet",
        amount: formik.values.amount,
        pin: transactionPin,
      });

      const response = await api.post(
        "/api/p2p",
        {
          user_id: activeUser.id,
          receiver_id: receiverId,
          wallet: "e_wallet",
          amount: formik.values.amount,
          pin: transactionPin,
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
        refreshUser();
        setPinModal(false);

        formik.resetForm();
        setRecipientNameDisplay("");
        setRecipientConfirmed(false);
        setReceiverId(null);
        setPinModal(false);
      } else {
        console.error("Transfer failed:", response.data.message);
        toast.error(response.data.message || "Transfer failed");
      }
    } catch (error) {
      console.error("Error during transfer:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during the transfer";
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
    }
  };

  const onDecline = (transactionPin) => {
    if (transactionPin) {
      setPinModal(false);
    } else {
      setPinModal(false);
    }
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
                      disabled={!formik.values.recipientName || validating}
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
                  disabled={!recipientConfirmed}
                  className="bg-primary text-white px-6 py-2 rounded-full w-full sm:w-auto disabled:bg-gray-400"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {pinModal && (
        <PinModal onClose={onDecline} onConfirm={onSubmit} user={activeUser} />
      )}
    </>
  );
};

export default EwalletTransfer;
