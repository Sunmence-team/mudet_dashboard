import { Users } from "lucide-react";
import React from "react";
import { IoWallet } from "react-icons/io5";
import { CgArrowRight } from "react-icons/cg";
import { Link } from "react-router-dom";
import { formatterUtility } from "../../utilities/formatterutility";

const OverviewCard = ({ details }) => {
  const { walletType, walletBalance, path, pathName, color, users, type, noSign } =
    details;

  const bgColor =
    color === "deepGreen"
      ? "#2B7830"
      : color === "gold"
      ? "#A9890B"
      : color === "lightGreen"
      ? "#6CAE0A"
      : "#ffffff";
  const textColor = bgColor === "#ffffff" ? "#000000" : "#ffffff";
  return (
    <div
      className="flex flex-col rounded-[10px] px-4 py-[14px] gap-3 shadow"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex flex-col items-start text-sm lg:text-base font-light">
        <h3>{walletType}</h3>
        <div className="flex gap-2 items-center">
          {type === "wallet" ? <IoWallet size={25} /> : type === "users" && <Users />}
          <h2 className="text-base lg:text-2xl font-semibold">
            {formatterUtility((type === "wallet" ? walletBalance : type === "users" ? users : 0), noSign)}
          </h2>
        </div>
      </div>
      <div className="w-full text-gray-300 font-bold">
        <hr />
      </div>
      <Link
        to={path}
        className="flex gap-1 items-center flex-row-reverse group"
      >
        {pathName ? (
          <>
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
          </>
        ) : null}
      </Link>
    </div>
  );
};

export default OverviewCard;
