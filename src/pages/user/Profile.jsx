import React, { useState } from "react";
import ResetPassword from "./profiletab/ResetPassword";
import ResetPin from "./profiletab/ResetPin";
import ContactDetails from "./profiletab/ContactDetails";
import PersonalDetails from "./profiletab/PersonalDetails";
import BankDetails from "./profiletab/BankDetails";
import {
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaUser,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("password");

  const tabs = [
    { key: "password", label: "Password Reset" },
    { key: "pin", label: "Pin Reset" },
    { key: "personal", label: "Personal Details" },
    { key: "contact", label: "Contact Details" },
    { key: "bank", label: "Bank Details" },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6">
        
        <div className="bg-white  rounded-2xl shadow flex flex-col items-center border">
          <div className="w-30 h-30 flex items-center justify-center rounded-full bg-[var(--color-primary)]/30 text-green-900 font-bold text-[36px] mt-6">
            OD
          </div>
          <h2 className="mt-3 font-semibold text-lg text-gray-800 text-center">
            Odekunle Dorcas
          </h2>
          <p className="text-gray-500 text-sm">@dorcas</p>

          
          <div className="mt-6 space-y- w-full">
            <div className="border-y-2 p-4 border-black/30">
              <p className="text-sm flex justify-between text-center">
                <span className="font-semibold text-black text-[16px]">
                  EMAIL:
                </span>{" "}
                DorcasTiwa@gmail.com
              </p>
            </div>
            <div className="border-b-2 p-4 border-black/30 text-center">
              <p className="text-sm flex justify-between text-center">
                <span className="font-semibold text-black text-[16px]">
                  USERNAME:
                </span>{" "}
                Dorcas
              </p>
            </div>
            <div className="border-b-2 p-4 border-black/30 text-center">
              <p className="text-sm flex justify-between text-center">
                <span className="font-semibold text-black text-[16px]">
                  PACKAGE:
                </span>{" "}
                Gold
              </p>
            </div>
            <div className="border-b-2 p-4 border-black/30 text-center">
              <p className="text-sm flex justify-between text-center">
                <span className="font-semibold text-black text-[16px]">
                  CURRENT RANK:
                </span>{" "}
                No Rank
              </p>
            </div>
          </div>

          <button className="mt-10 mb-5 bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border-1 text-white text-sm font-medium py-4 px-5 rounded-4xl">
            Upgrade Package
          </button>
        </div>

        
        <div className="flex flex-col gap-6">
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-[var(--color-primary)] text-white rounded-xl p-6 flex justify-between items-center">
              <div className="flex gap-2 items-center text-center">
                <FaUser className="w-[18px] h-[18px]" />
                <span className="text-sm font-semibold "> Personal PV</span>
              </div>
              <span className="text-2xl font-bold mt-1">27376</span>
            </div>

            <div className="bg-[var(--color-secondary)] text-white rounded-xl p-6 flex justify-between items-center">
              <div className="flex gap-2 items-center text-center">
                <HiUserGroup className="w-[22px] h-[22px]" />
                <span className="text-sm font-semibold ">Total PV</span>
              </div>
              <span className="text-2xl font-bold mt-1">9274</span>
            </div>

            
            <div className="bg-[var(--color-secondary)] text-white rounded-xl p-6 flex justify-between items-center">
              <div className="flex gap-2 items-center text-center">
                <FaLongArrowAltRight className="w-[18px] h-[18px]" />
                <span className="text-sm font-semibold ">Right PV</span>
              </div>
              <span className="text-2xl font-bold mt-1">5746</span>
            </div>

            <div className="bg-[var(--color-primary)] text-white rounded-xl p-6 flex justify-between items-center">
              <div className="flex gap-2 items-center text-center">
                <FaLongArrowAltLeft className="w-[18px] h-[18px]" />
                <span className="text-sm font-semibold ">Right PV</span>
              </div>
              <span className="text-2xl font-bold mt-1">3528</span>
            </div>
          </div>

          
          <div className="bg-white p- rounded-2xl shadow">
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
