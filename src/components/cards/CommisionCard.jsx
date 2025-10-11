import { Users } from "lucide-react";
import React from "react";
import { IoWallet } from "react-icons/io5";
import { CgArrowRight } from "react-icons/cg";
import { Link } from "react-router-dom";
import { formatterUtility } from "../../utilities/formatterutility";
import DotsLoader from "../loaders/DotsLoader";

const CommisionCard = ({ details, index, isLoading }) => {
  const colors = ["deepGreen", "gold", "lightGreen"];
  const { color = colors[index % colors.length], user, total_amount, total_transactions } = details;

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
        <h3 className="uppercase">@{user?.username}</h3>
        <div className="flex gap-2 items-center">
          {/* {type === "wallet" ? <IoWallet size={25} /> : type === "users" && <Users />} */}
          <h2 className="text-base lg:text-2xl font-semibold">
            {isLoading ? <DotsLoader /> : formatterUtility(Number(total_amount))}
          </h2>
        </div>
      </div>
      <div className="w-full text-gray-300 font-bold">
        <hr />
      </div>
      <div>
        Count : {formatterUtility(Number(total_transactions), true)}
      </div>
    </div>
  );
};

export default CommisionCard;
