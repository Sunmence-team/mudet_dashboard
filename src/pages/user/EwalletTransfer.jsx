import React, { useEffect, useState } from "react";
import OverviewCard from "../../components/cards/OverviewCard";
import { useFormik } from "formik";
import PinModal from "../../components/modals/PinModal";

const EwalletTransfer = () => {
  const [activeUser, setActiveUser] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [recipientNameDisplay, setRecipientNameDisplay] = useState("");
  const [recipientConfirmed, setRecipientConfirmed] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setActiveUser(user);
  }, []);

  // Function to fetch recipient's full name based on recipientName
  const fetchRecipientName = async (recipientName) => {
    try {
      const response = await fetch(`/api/me=${recipientName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.ok && data.user) {
        setRecipientNameDisplay(`Full Name: ${data.user.full_name}`);
      } else {
        setRecipientNameDisplay("User not found");
      }
    } catch (error) {
      console.error("Error fetching recipient:", error);
      setRecipientNameDisplay("Error fetching user");
    }
  };

  // Handle confirm recipient button
  const handleConfirmRecipient = () => {
    if (formik.values.recipientName) {
      fetchRecipientName(formik.values.recipientName);
      setRecipientConfirmed(true);
    }
  };

  // Handle API call for transfer
  const handleTransfer = async (pin) => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/p2p", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          recipientName: formik.values.recipientName,
          amount: formik.values.amount,
          transactionPin: pin,
        }),
      });
      const data = await response.json();
      if (data.ok) {
        console.log("Transfer successful:", data);
        setActiveUser((prev) => ({
          ...prev,
          e_wallet: data.data.sender.e_wallet,
        }));
        formik.resetForm();
        setRecipientNameDisplay("");
        setRecipientConfirmed(false);
        setPinModal(false);
      } else {
        console.error("Transfer failed:", data.message);
      }
    } catch (error) {
      console.error("Error during transfer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = () => {
    if (!recipientConfirmed) {
      handleConfirmRecipient();
      return;
    }
    const transactionPin = sessionStorage.getItem("currentAuth");
    if (!transactionPin) {
      setPinModal(true);
      return;
    }
    handleTransfer(transactionPin);
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      recipientName: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.amount) errors.amount = "Required";
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
      walletBalance: +activeUser.e_wallet,
      path: "/admin/",
      pathName: "Fund Wallet",
      color: "deepGreen",
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-7">
        <h1 className="text-2xl font-semibold text-black">E-Wallet Transfer</h1>
        <div className="grid grid-cols-1 gap-4">
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
                    Recipient Name
                    {formik.touched.recipientName && formik.errors.recipientName && (
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
                      placeholder="Enter Recipient Name"
                      value={formik.values.recipientName}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setRecipientConfirmed(false); // Reset confirmation on input change
                        setRecipientNameDisplay(""); // Clear display on input change
                      }}
                      onBlur={formik.handleBlur}
                      className={`h-12 px-4 py-2 border w-full ${
                        formik.touched.recipientName && formik.errors.recipientName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-pryClr focus:border-pryClr`}
                    />
                    <button
                      type="button"
                      onClick={handleConfirmRecipient}
                      disabled={!formik.values.recipientName || submitting}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                    >
                      Done
                    </button>
                  </div>
                </div>

                {recipientConfirmed && (
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
                      className="h-12 px-4 py-2 border w-full border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !recipientConfirmed}
                  className="bg-primary text-white px-6 py-2 rounded-full w-full sm:w-auto disabled:bg-gray-400"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {pinModal ? (
        <PinModal
          onClose={() => setPinModal(false)}
          onConfirm={(pin) => handleTransfer(pin)}
        />
      ) : null}
    </>
  );
};

export default EwalletTransfer;