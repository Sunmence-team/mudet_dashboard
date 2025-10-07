import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useEffect } from "react";

const PackageCard = () => {
  const { user } = useUser();
  // const backUpUser = JSON.parse(localStorage.getItem("user"));
  const name = `${user.first_name || backUpUser.first_name} ${
    user.last_name || backUpUser.last_name
  }`;

  return (
    <div className="bg-[#FFFFFF] shadow-[2px_2px_3px] shadow-[#000000]/20 rounded-[10px] p-[2.9rem] flex flex-col gap-7 lg:mx-0 mx-auto">
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="w-17 h-17 flex justify-center items-center rounded-full font-bold text-2xl bg-[#2B7830]/30 text-primary">
          <h3>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </h3>
        </div>
        <div className="">
          <h2 className="text-[18px] font-semibold">
            {user.first_name} {user.last_name}
          </h2>
        </div>
        <div className="flex justify-between items-center gap-4 text-base">
          <h4 className="flex gap-1 items-center">
            Package:
            <span className="font-semibold">
              {" "}
              {user.stockist_plan?.slice(0, 5)}...
            </span>
          </h4>
          <h4 className="flex gap-1 items-center">
            Rank:
            <span className="font-semibold">
              {" "}
              {user.rank ? user.rank : "No Rank"}
            </span>
          </h4>
        </div>
      </div>
      <div className="mx-auto">
        <Link
          to={"/user/upgrade-package"}
          className="py-2 px-9 border-0 bg-[#1B6020] rounded-3xl text-white cursor-pointer font-medium"
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;
