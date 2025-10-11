import React, { useEffect, useState } from "react";
import ResetPassword from "./profiletab/ResetPassword";
import ResetPin from "./profiletab/ResetPin";
import ContactDetails from "./profiletab/ContactDetails";
import PersonalDetails from "./profiletab/PersonalDetails";
import BankDetails from "./profiletab/BankDetails";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaUser,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { formatterUtility } from "../../utilities/formatterutility";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [activeUser, setActiveuser] = useState({});
  const { user, miscellaneousDetails } = useUser();
  const name = `${user?.first_name} ${user?.last_name}`;

  const tabs = [
    { key: "password", label: "Password Reset" },
    { key: "pin", label: "Pin Reset" },
    { key: "personal", label: "Personal Details" },
    { key: "contact", label: "Contact Details" },
    { key: "bank", label: "Bank Details" },
  ];

  useEffect(() => {
    setActiveuser(user);
  }, []);

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-5">Profile</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_3fr] gap-6">
        {/* Profile Card (fixed height removed, content-based height instead) */}
        <div className="bg-white rounded-2xl shadow flex flex-col items-center h-[520px] ">
          <div className="p-6 flex items-center justify-center rounded-full bg-[var(--color-primary)]/30 text-green-900 font-bold text-[36px] mt-6">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>

          <h2 className="mt-2 font-semibold text-lg text-gray-800 text-center">
            {activeUser?.first_name} {activeUser?.last_name}
          </h2>
          <p className="text-gray-500 text-sm">@{activeUser?.username}</p>

          <div className="mt-4 space-y-2 w-full">
            <div className="border-y-1 p-3 border-black/30">
              <p className="text-sm flex justify-between">
                <span className="font-semibold text-black text-[16px]">
                  EMAIL:
                </span>{" "}
                {activeUser?.email}
              </p>
            </div>
            <div className="border-b-1 p-3 border-black/30">
              <p className="text-sm flex justify-between">
                <span className="font-semibold text-black text-[16px]">
                  USERNAME:
                </span>{" "}
                {activeUser?.username}
              </p>
            </div>
            <div className="border-b-1 p-3 border-black/30">
              <p className="text-sm flex justify-between capitalize">
                <span className="font-semibold text-black text-[16px]">
                  PACKAGE:
                </span>{" "}
                {miscellaneousDetails?.planDetails?.name ? miscellaneousDetails?.planDetails?.name : "None"}
              </p>
            </div>
            <div className="border-b-1 p-3 border-black/30">
              <p className="text-sm flex justify-between">
                <span className="font-semibold text-black text-[16px]">
                  CURRENT RANK:
                </span>{" "}
                {activeUser?.rank ? activeUser?.rank : "No Rank"}
              </p>
            </div>
          </div>

          {/* Button now fits nicely inside */}
          <Link
            to={"/user/upgrade-package"}
            className="mt-6 mb-4 bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border text-white text-sm font-medium py-3 px-6 rounded-4xl"
          >
            Upgrade Package
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--color-primary)] text-white rounded-xl p-6 flex justify-between items-center">
              <div className="flex gap-2 items-center text-center">
                <FaUser className="w-[18px] h-[18px]" />
                <span className="text-sm font-semibold "> Personal PV</span>
              </div>
              <span className="text-2xl font-bold mt-1">
                {formatterUtility(Number(activeUser?.personal_pv), true)}
              </span>
            </div>

            <div className="bg-[var(--color-secondary)] text-white rounded-xl p-6 flex justify-between items-center">
              <div className="flex gap-2 items-center text-center">
                <HiUserGroup className="w-[22px] h-[22px]" />
                <span className="text-sm font-semibold ">Total PV</span>
              </div>
              <span className="text-2xl font-bold mt-1">
                {formatterUtility((Number(miscellaneousDetails?.totalPVLeft) + Number(miscellaneousDetails?.totalPVRight)), true)}
              </span>
            </div>

            <div className="bg-[var(--color-secondary)] text-white rounded-xl p-6 flex justify-between items-center">
              <div className="flex gap-2 items-center text-center">
                <FaArrowAltCircleRight className="w-[18px] h-[18px]" />
                <span className="text-sm font-semibold ">Right PV</span>
              </div>
              <span className="text-2xl font-bold mt-1">
                {formatterUtility(Number(miscellaneousDetails?.totalPVLeft), true)}
              </span>{" "}
            </div>

            <div className="bg-[var(--color-primary)] text-white rounded-xl p-6 flex justify-between items-center">
              <div className="flex gap-2 items-center text-center">
                <FaArrowAltCircleLeft className="w-[18px] h-[18px]" />
                <span className="text-sm font-semibold ">Left PV</span>
              </div>
              <span className="text-2xl font-bold mt-1">
                {formatterUtility(Number(miscellaneousDetails?.totalPVRight), true)}
              </span>{" "}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow">
            <div className="flex flex-nowrap gap-6 items-center overflow-x-auto scrollbar-hide px-6 bg-white py-4 rounded shadow md:flex-wrap md:justify-between md:overflow-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap border-b-2 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-transparent text-gray-500 hover:text-[var(--color-primary)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "password" && <ResetPassword />}
            {activeTab === "pin" && <ResetPin />}
            {activeTab === "contact" && <ContactDetails />}
            {activeTab === "personal" && <PersonalDetails />}
            {activeTab === "bank" && <BankDetails />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
