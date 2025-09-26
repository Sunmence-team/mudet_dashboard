import React from "react";
import OverviewCard from "../../components/cards/OverviewCard";
import AnnouncementCard from "../../components/cards/AnnouncementCard";

const AdminOverview = () => {
  const topWallets = [
    {
      type:"users",
      walletType: "Total Number Users",
      users: 800,
      path: "/admin/users",
      pathName: "View all",
      color: "deepGreen",
    },
    {
      type:"wallet",
      walletType: "Pending Deposit",
      walletBalance: 0,
      path: "/admin/",
      pathName: "View Queue",
      color: "gold",
    },
    {
      type:"wallet",
      walletType: "Total Credit",
      walletBalance: 0,
      path: "/user/",
      pathName: "View History",
      color: "lightGreen",
    },
    {
      type:"wallet",
      walletType: "Total Debit",
      walletBalance: 0,
      path: "/user/",
      pathName: "View History",
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="grid lg:grid-cols-2 lg:grid-rows-2 grid-cols-1 gap-2">
          {topWallets.map((wallet, index) => (
            <OverviewCard details={wallet} key={index} />
          ))}
        </div>
        <div className="w-full">
          <div className="w-full lg:mx-0 mx-auto">
            <AnnouncementCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
