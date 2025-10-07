import { useFormik } from "formik";
import React, { useState } from "react";
import { toast } from "sonner";
import api from "../utilities/api";
import axios from "axios";
import { useUser } from "../context/UserContext";
import OverviewCard from "../components/cards/OverviewCard";
import InventoryHistory from "./user/stockisttabs/InventoryHistory";
import RepurchaseHistory from "./user/stockisttabs/RepurchaseHistory";
import UpgradeHistory from "./user/stockisttabs/UpgradeHistory";
import TransactionHistory from "./user/stockisttabs/TransactionHistory";
import RegistrationHistory from "./user/stockisttabs/RegistrationHistory";

const StockistUser = () => {
  const [stockistChoice, setStockistChoice] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [activeTab, setActiveTab] = useState("Inventory");
  const tabs = [
    "Inventory",
    "Repurchase Order",
    "Registration Order",
    "Upgrade Order",
    "Transaction History",
  ];
  const backUpuser = JSON.parse(localStorage.getItem("user"));
  const { user } = useUser();
  const stockistWallet = {
    type: "wallet",
    walletType: "Stockist Balance",
    walletBalance: +user?.stockist_balance || +backUpuser.stockist_balance,
    path: "/user/transfer",
    pathName: "Withdraw",
    color: "deepGreen",
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      stockist_plan: stockistChoice || "",
      stockist_location: "",
      termsAndConditions: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.stockist_plan) errors.stockist_plan = "Required";
      if (!values.stockist_location) errors.stockist_location = "Required";
      if (!values.termsAndConditions) errors.termsAndConditions = "Required";
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      setRequesting(true);
      try {
        const res = await api.post("/api/stockist/request", values);
        if (res.status === 200) {
          toast.success("Stockist request created successfully.");
          let load;
          setTimeout(() => {
            load = toast.loading("Proceeding to payment");
          }, 300);
          setTimeout(() => {
            window.open(res.data.authorization_url);
          }, 2000);
          toast.dismiss(load);
        } else {
          toast.error("Stockist request failed");
        }
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
            "An unexpected error occurred while requesting stockist registration. " +
              error?.response?.data?.message ||
              error?.message ||
              "Please try again later."
          );
          console.error(
            "Error during requesting stockist registration:",
            error
          );
        }
      } finally {
        resetForm();
        setRequesting(false);
      }
    },
  });

  return (
    <div className="w-full flex flex-col gap-4 items-cente justify-center">
      {user?.stockist_enabled === 0 || backUpuser.stockist_enabled === 0 ? (
        stockistChoice === "" ? (
          <>
            <p className="text-lg font-semibold">Stockist</p>
            <div className="w-full flex flex-col gap-8">
              <div className="w-full rounded-lg border border-black/10 bg-white p-8 flex flex-col gap-4">
                <p className="text-lg md:text-2xl font-semibold">
                  MAX STORE ( STOCKIST )
                </p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-xl font-semibold">Requirements</p>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        a. Office & Facilities
                      </p>
                      <p>
                        An office space with storage capacity. A
                        seminar/training hall that can seat at least 20 people
                        comfortably. Decent convenience facilities for visitors
                        and members.
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        b.Branding & Exclusivity
                      </p>
                      <p>
                        Office must be fully branded in Mudet Real Solution
                        identity (at the cost of the MAX Store). Only Mudet Real
                        Solution products are permitted to be displayed and sold
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        c. Package Level
                      </p>
                      <p>Must be subscribed to the Highest Package (LEGEND).</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        d. Application & Approval
                      </p>
                      <p>
                        Submit an application for inspection and consideration
                        by Mudet Real Solution. Upon approval, proceed to
                        payment.
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        e. Registration Fee
                      </p>
                      <p>
                        Pay a non-refundable MAX STORE fee of ₦10,000,000.00
                        only. What a MAX STORE Owner Receives After Payment 600
                        bottles of 750ml Cinnamon Herbal Extract; OR 200 bottles
                        of 500ml Armor Herbal Extract; OR 800 bottles (mix of
                        Cinnamon & Armor Herbal Extracts), depending on company
                        discretion and product availability. Marketing &
                        Branding Materials: Flyers, brochures, branded nylon
                        bags. Point Value (PV) Allocation: 12,000 PV
                        automatically credited to the distributor’s reorder end
                        (Auto-ship). 1,800 PV (15%) goes to the Binary End.
                        10,200 PV remains in the Unilevel End
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-xl font-semibold">
                      Benefits of Being a MAX STORE Owner
                    </p>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        a. Personal Repurchase Bonus (PRB)
                      </p>
                      <p>
                        Earn 15% of the Unilevel PV stockist_plan the initial
                        purchase. Example: 15% of 10,200 PV = ₦918,000 paid
                        directly to the MAX STORE
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        b. Store Clearance Commission
                      </p>
                      <p>
                        Earn 10% of every product cleared by distributors from
                        your store. Example: You earn ₦1,400 per bottle of 750ml
                        Cinnamon/Armor Herbal Extract sold.
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        c. Mini Store (MIS) Override
                      </p>
                      <p>
                        Earn 20% commission on every product released by a Mini
                        Store under your MAX STORE.
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        d. A fixed and one time 150 000 commission for office
                        maintenance for MAX store
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        e. Service Center Override
                      </p>
                      <p>
                        Earn 10% equivalent of what Mini Stores under you earn
                        as fixed and one time MNI store commissions/ Bonus
                        Benefits for the Upline of a MAX STORE The direct upline
                        of the MAX STORE earns up to 6% of the Unilevel PV
                        generated. The indirect uplines earn 5%, with
                        commissions continuing up to the 15th generation, in
                        line with the Unilevel Commission structure. Additional
                        Advantage: The entire 12,000 PV generated will count
                        upwards towards Awards Qualification for everyone in the
                        genealogy.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    className="bg-primary text-white py-2 rounded-4xl w-full"
                    onClick={() => setStockistChoice("max_owner")}
                  >
                    Become a MAX STORE OWNER
                  </button>
                </div>
              </div>

              <div className="w-full rounded-lg border border-black/10 bg-white p-8 flex flex-col gap-4">
                <p className="text-lg md:text-2xl font-semibold">
                  MINI STORE ( STOCKIST )
                </p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-xl font-semibold">Requirements</p>
                    <div className="flex flex-col">
                      <p>
                        1. An office space with storage capacity, hall for
                        seminars/trainings that can seat at least 20 people
                        comfortably.
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        b.Branding & Exclusivity
                      </p>
                      <p>
                        Office must be fully branded in Mudet Real Solution
                        identity (at the cost of the MAX Store). Only Mudet Real
                        Solution products are permitted to be displayed and sold
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p>
                        2. Office must be fully branded for MUDET REAL SOLUTION
                        (by the MAX STORE)and must have EXCLUSIVELY MUDET REAL
                        SOLUTION products.
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p>3. Must be on the Highest package ( LEGEND )</p>
                    </div>
                    <div className="flex flex-col">
                      <p>
                        4. Apply to MUDET REAL SOLUTION for inspection &
                        consideration
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p>
                        5. If application is successful, pay the non-refundable
                        MAX STORE fee of N2,500,000.00 only
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">Note:</p>
                      <div className="flex flex-col">
                        <p>
                          After payment, the MINI STORE may receive the
                          following:
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p>A. 150 bottles of 750ml CINNAMON herbal extracts</p>
                      </div>
                      <div className="flex flex-col">
                        <p>B. 50 bottles of 500ml ARMOR herbal extracts.</p>
                      </div>
                      <div className="flex flex-col">
                        <p>
                          C. OR 200 bottles of CINNAMON/ ARMOR HERBAL EXTRACT,
                          though Company has the right to use her discretion
                          depends on the availability of the products.
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p>D.Flyers, Brochures and branded Nylon bags.</p>
                      </div>
                      <div className="flex flex-col">
                        <p>
                          E. A total of 2500PV will be keyed in to the
                          distributor's reorder end ( AUTO SHIP). 10% of that
                          (2500PV) will go to the binary end(250) & 2,250 PV
                          will remain in the Unilevel end
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-xl font-semibold">
                      Benefits of Being a MAX STORE Owner
                    </p>
                    <div className="flex flex-col">
                      <p>
                        a. 10% of the UNILEVEL point from that purchase, i.e 10%
                        of 2250PV = 10÷100×2250=225×600=135000 will be paid to
                        the MINI STORE as PRB (Personal Repurchase Bonus).
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p>
                        b. In Addition, the MINI Store owner will earn 8% of
                        every product cleared from his/her Store to
                        distributors. That is, you will earn N1120 from every
                        bottle of 750ml CINNAMON/ ARMOR herbal extracts cleared
                        in your MINI store
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p>
                        c. The direct upline of the MINI STORE (depending on
                        your package) may earn up to 7% of the PV that goes into
                        UNILEVEL. that is; 7% of 2250PV{" "}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        d. The indirect upline will earn 5% of the earnings, as
                        prescribed in the UNILEVEL COMMISSION, continues up till
                        15 generations upward*
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-primary font-semibold">
                        e. Service Center Override
                      </p>
                      <p>
                        Earn 10% equivalent of what Mini Stores under you earn
                        as fixed and one time MNI store commissions/ Bonus
                        Benefits for the Upline of a MAX STORE The direct upline
                        of the MAX STORE earns up to 6% of the Unilevel PV
                        generated. The indirect uplines earn 5%, with
                        commissions continuing up to the 15th generation, in
                        line with the Unilevel Commission structure. Additional
                        Advantage: The entire 12,000 PV generated will count
                        upwards towards Awards Qualification for everyone in the
                        genealogy.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    className="bg-primary text-white py-2 rounded-4xl w-full"
                    onClick={() => setStockistChoice("mini_owner")}
                  >
                    Become a MINI STORE OWNER
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">Stockist Registration</p>
            <form
              onSubmit={formik.handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
                <p className="text-xl md:text-2xl font-semibold">
                  Store Information
                </p>

                <div className="flex flex-col w-full">
                  <label
                    htmlFor="stockist_plan"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Store Name
                    {formik.touched.stockist_plan &&
                      formik.errors.stockist_plan && (
                        <span className="text-red-500 text-xs">
                          {" "}
                          - {formik.errors.stockist_plan}
                        </span>
                      )}
                  </label>
                  <input
                    type="text"
                    id="stockist_plan"
                    name="stockist_plan"
                    value={formik.values.stockist_plan}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                    className={`h-12 px-4 py-2 border w-full ${
                      formik.touched.stockist_plan &&
                      formik.errors.stockist_plan
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-pryClr cursor-not-allowed opacity-[60%] focus:border-pryClr`}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label
                    htmlFor="stockist_location"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Store Location
                    {formik.touched.stockist_location &&
                      formik.errors.stockist_location && (
                        <span className="text-red-500 text-xs">
                          {" "}
                          - {formik.errors.stockist_location}
                        </span>
                      )}
                  </label>
                  <input
                    type="text"
                    id="stockist_location"
                    name="stockist_location"
                    value={formik.values.stockist_location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-12 px-4 py-2 border w-full ${
                      formik.touched.stockist_location &&
                      formik.errors.stockist_location
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-pryClr focus:border-pryClr`}
                  />
                </div>

                <div className="flex gap-2 w-full items-start">
                  <input
                    type="checkbox"
                    id="termsAndConditions"
                    name="termsAndConditions"
                    checked={formik.values.termsAndConditions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${
                      formik.touched.termsAndConditions &&
                      formik.errors.termsAndConditions
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-pryClr focus:border-pryClr`}
                  />
                  <label
                    htmlFor="termsAndConditions"
                    className="text-xs font-medium text-gray-700 mb-1"
                  >
                    Agree to terms and conditions
                    {formik.touched.termsAndConditions &&
                      formik.errors.termsAndConditions && (
                        <span className="text-red-500 text-xs">
                          {" "}
                          - {formik.errors.termsAndConditions}
                        </span>
                      )}
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-full w-full sm:w-auto"
                >
                  {requesting
                    ? "Requesting registration...."
                    : "Request registration"}
                </button>
              </div>
            </form>
          </>
        )
      ) : (
        <>
          <div className="w-full flex flex-col gap-4 justify-center">
            <p className="text-lg font-semibold">Stockist Balance</p>
            <div className="flex flex-col gap-9 justify-center">
              <div className="w-full lg:w-1/2">
                <OverviewCard details={stockistWallet} />
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
                <div className="flex border-b rounded-b-lg shadow border-gray-200 bg-gray-50 justify-between">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`nav-links relative py-3 cursor-pointer px-5 text-sm md:text-base font-medium transition-colors duration-200
                    ${
                      activeTab === tab
                        ? "text-primary active bg-white"
                        : "text-gray-600 hover:text-primary"
                    }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  {activeTab === "Inventory" ? (
                    <InventoryHistory />
                  ) : activeTab === "Repurchase Order" ? (
                    <RepurchaseHistory />
                  ) : activeTab === "Registration Order" ? (
                    <RegistrationHistory />
                  ) : activeTab === "Upgrade Order" ? (
                    <UpgradeHistory />
                  ) : activeTab === "Transaction History" ? (
                    <TransactionHistory />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StockistUser;
