import React, { useEffect, useState } from "react";
import OverviewCard from "../../../components/cards/OverviewCard";
import AnnouncementCard from "../../../components/cards/AnnouncementCard";
import { useFormik } from "formik";
import PinModal from "../../../components/modals/PinModal";
import { toast } from "sonner";
import api from "../../../utilities/api";
import axios, { isAxiosError } from "axios";

const TransferFunds = () => {
  const [activeUser, setActiveuser] = useState({});
  const [pinModal, setPinModal] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setActiveuser(user);
  }, []);

  const onSubmit = async () => {
    const transactionPin = localStorage.getItem("currentAuth");
    if (!transactionPin) {
      setPinModal(true);
      return;
    }
    try {
      const res = await api.post("/api/earning/fund/initiate", {
        ...formik.values,
        pin: transactionPin,
        user_id: activeUser.id,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        setPinModal(false);
        formik.resetForm();
      } else {
        toast.error(toast.data.message);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          "An unexpected error occurred while creating package. " +
            error?.response?.data?.message ||
            error?.message ||
            "Please try again later."
        );
        console.error("Error during creating package:", error);
      }
    }
  };
  const onDecline = () => {
    const transactionPin = localStorage.getItem("currentAuth");
    if (transactionPin) {
      localStorage.removeItem("currentAuth");
      setPinModal(false);
    } else {
      setPinModal(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      from: "",
      to: "",
      amount: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.from) errors.from = "Required";
      if (!values.to) errors.to = "Required";
      if (!values.amount) errors.amount = "Required";
      return errors;
    },
    onSubmit: () => {
      onSubmit();
    },
  });

  const topWallets = [
    {
      type: "wallet",
      walletType: "E-Wallet",
      walletBalance: +activeUser.e_wallet,
      path: "/admin/",
      pathName: "Fund Wallet",
      color: "deepGreen",
    },
    {
      type: "wallet",
      walletType: "Repurchase Wallet",
      walletBalance: +activeUser.purchased_wallet,
      path: "/admin/",
      pathName: "Repurchase Wallet",
      color: "gold",
    },
    {
      type: "wallet",
      walletType: "Earning Wallet",
      walletBalance: +activeUser.earning_wallet,
      path: "/user/",
      pathName: "Transfer",
      color: "lightGreen",
    },
    {
      type: "wallet",
      walletType: "Incentive Wallet",
      walletBalance: +activeUser.incentive_wallet,
      path: "/user/",
      pathName: "Withdraw",
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-7">
        <h1 className="text-2xl font-semibold text-black">Transfer</h1>
        <div className="grid lg:grid-cols-2 lg:grid-rows-2 grid-cols-1 gap-4">
          {topWallets.map((wallet, index) => (
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
                    htmlFor="from"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Transfer From
                    {formik.touched.from && formik.errors.from && (
                      <span className="text-red-500 text-xs">
                        {" "}
                        - {formik.errors.from}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="from"
                    name="from"
                    placeholder="Select Target Wallet"
                    value={formik.values.from}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-12 px-4 py-2 border w-full ${
                      formik.touched.from && formik.errors.from
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-pryClr focus:border-pryClr`}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label
                    htmlFor="to"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Transfer To
                    {formik.touched.to && formik.errors.to && (
                      <span className="text-red-500 text-xs">
                        {" "}
                        - {formik.errors.to}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="to"
                    name="to"
                    placeholder="Select Destination Wallet"
                    value={formik.values.to}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-12 px-4 py-2 border w-full ${
                      formik.touched.to && formik.errors.to
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-pryClr focus:border-pryClr`}
                  />
                </div>

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

                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-full w-full sm:w-auto"
                >
                  Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {pinModal ? (
        <PinModal onClose={onDecline} onConfirm={onSubmit} user={activeUser} />
      ) : null}
    </>
  );
};

export default TransferFunds;
