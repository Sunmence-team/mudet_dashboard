import React from "react";
import SearchInput from "../../components/SearchInput";
import PackageCard from "../../components/cards/PackageCard";
import OverviewCard from "../../components/cards/OverviewCard";
import AnnouncementCard from "../../components/cards/AnnouncementCard";
import MembersCard from "../../components/cards/MembersCard";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Overview = () => {
  const { user } = useUser();
  const firstName = user.first_name || "User";

  const topWallets = [
    {
      type: "wallet",
      walletType: "E-Wallet",
      walletBalance: parseFloat(user.e_wallet || 0),
      path: "/user/deposit",
      pathName: "Fund Wallet",
      color: "deepGreen",
    },
    {
      type: "wallet",
      walletType: "Incentive Wallet",
      walletBalance: parseFloat(user.incentive_wallet || 0),
      path: "/user/withdraw",
      pathName: "Withdraw",
      color: "gold",
    },
    {
      type: "wallet",
      walletType: "Repurchase Wallet",
      walletBalance: parseFloat(user.purchased_wallet || 0),
      path: "/user/transfer",
      pathName: "Repurchase Wallet",
      color: "lightGreen",
    },
  ];

  const otherWallets = [
    {
      type: "wallet",
      walletType: "Total Credit",
      walletBalance: parseFloat(user.total_credit || 0),
      path: "/user/transactions",
      pathName: "History",
    },
    {
      type: "wallet",
      walletType: "Earning Wallet",
      walletBalance: parseFloat(user.earning_wallet || 0),
      path: "/user/transfer",
      pathName: "Transfer",
    },
    {
      type: "wallet",
      walletType: "Total Debit",
      walletBalance: parseFloat(user.total_debit || 0),
      path: "/user/transfer",
      pathName: "History",
    },
    {
      type: "wallet",
      walletType: "Unilevel Wallet",
      walletBalance: parseFloat(user.unilevel_wallet || 0),
      // path: "/user/",
      // pathName: "Repurchase Wallet",
    },
  ];

  return (
    <div className="flex flex-col gap-[2rem]">
      <div className="flex justify-between lg:items-center items-start gap-4">
        <div className="flex flex-col text-justify">
          <h3 className="text-xl font-semibold">Hello, {firstName}</h3>
          <p className="text-base">Here’s your dashboard overview</p>
        </div>
        <div className="lg:block hidden">
          <SearchInput />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-end gap-4 w-full">
        <div className="w-full lg:w-[25%]">
          <PackageCard />
        </div>
        <div className="flex flex-col gap-4 lg:w-[75%] w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {topWallets.map((wallet, index) => (
              <OverviewCard details={wallet} key={index} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherWallets.map((wallet, index) => (
              <OverviewCard details={wallet} key={index} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between lg:mt-7 mt-4 gap-9 lg:flex-row flex-col md:flex-row md:flex-wrap lg:flex-nowrap">
        <div className="lg:w-[65%] w-full lg:mx-0 mx-auto">
          <AnnouncementCard />
        </div>
        <div className="lg:w-[35%] w-full lg:mx-0 mx-auto">
          <MembersCard />
        </div>
      </div>
    </div>
  );
};

export default Overview;