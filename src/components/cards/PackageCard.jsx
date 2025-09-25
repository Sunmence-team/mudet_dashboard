import React from "react";

const PackageCard = () => {
  const userDetails = {
    name: "Odekunle Dorcas",
    initials: "OD",
    package: "Gold",
    rank: "",
  };
  return (
    <div className="bg-[#FFFFFF] shadow-[2px_2px_3px] shadow-[#000000]/20 rounded-[10px] p-[2.8rem] flex flex-col gap-7 lg:mx-0 mx-auto">
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="w-17 h-17 flex justify-center items-center rounded-full font-bold text-2xl bg-[#2B7830]/30 text-primary">
          <h3>{userDetails.initials}</h3>
        </div>
        <div className="">
          <h2 className="text-[18px] font-semibold">{userDetails.name}</h2>
        </div>
        <div className="flex justify-between items-center gap-4 text-base">
          <h4 className="flex gap-1 items-center">
            Package:
            <span className="font-semibold"> {userDetails.package}</span>
          </h4>
          <h4 className="flex gap-1 items-center">
            Rank:
            <span className="font-semibold">
              {" "}
              {userDetails.rank ? userDetails.rank : "No Rank"}
            </span>
          </h4>
        </div>
      </div>
      <div className="mx-auto">
        <button className="py-2 px-9 border-0 bg-[#1B6020] rounded-3xl text-white cursor-pointer font-medium">
          Upgrade
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
