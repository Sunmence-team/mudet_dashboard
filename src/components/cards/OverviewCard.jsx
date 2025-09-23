import React from "react";
import { BiWallet } from "react-icons/bi";
import { CgArrowRight } from "react-icons/cg";
import { Link } from "react-router-dom";

const OverviewCard = ({ details }) => {
  const { walletType, walletBalance, path, pathName } = details;

  const bgColor =
    walletType === "E-Wallet"
      ? "#2B7830"
      : walletType === "Incentive Wallet"
      ? "#A9890B"
      : walletType === "Repurchase Wallet"
      ? "#6CAE0A"
      : "#ffffff";
  const textColor = bgColor === "#ffffff" ? "#000000" : "#ffffff";
  return (
    <div
      className="flex flex-col rounded-[10px] px-4 py-4 gap-3 shadow"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex flex-col items-start text-sm lg:text-base font-light">
        <h3>{walletType}</h3>
        <div className="flex gap-2 items-center">
          <BiWallet size={25} />
          <h2 className="text-base lg:text-2xl font-semibold">
            ₦{walletBalance}
          </h2>
        </div>
      </div>
      <div className="w-full text-[#FFFFFF]/50 font-bold">
        <hr />
      </div>
      <Link
        to={path}
        className="flex gap-1 items-center flex-row-reverse group"
      >
        <div
          className="p-1 rounded-[50%] text-center"
          style={{
            color: bgColor,
            backgroundColor: bgColor === "#ffffff" ? "#2B7830" : "white",
          }}
        >
          <CgArrowRight className={`rotate-[-45deg]`} />
        </div>
        <p className="group-hover:underline lg:text-sm text-xs font-light">
          {pathName}
        </p>
      </Link>
    </div>
  );
};

export default OverviewCard;
