import React, { useEffect, useState } from "react";
import OverviewCard from "../../components/cards/OverviewCard";
import AnnouncementCard from "../../components/cards/AnnouncementCard";
import { useUser } from "../../context/UserContext";
import api from "../../utilities/api";
import { toast } from "sonner";
import Commissions from "./transactions/Commissions";

const AdminOverview = () => {
  const { token } = useUser();
  const [overviewDetails, setOverviewDetails] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

  const fetchOverviewDetails = async () => {
    setIsFetching(true)
    try {
      const response = await api.get(`/api/stat`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      console.log("overview response", response)

      if (response.status === 200) {
        setOverviewDetails(response.data)
      } else {
        throw new Error(response.data.message || "Failed to get overview data.");
      }
      
    } catch (error) {
      console.error("An error occured fetching overview data", error)
      toast.error("An error occured fetching overview data")
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchOverviewDetails()
  }, [token])

  const topWallets = [
    {
      type:"users",
      walletType: "Total Number Users",
      users: overviewDetails?.total_users,
      path: "/admin/users",
      pathName: "View all",
      color: "deepGreen",
      noSign: true,
    },
    {
      type:"wallet",
      walletType: "Pending Deposit",
      walletBalance: overviewDetails?.pending_e_wallet,
      path: "/admin/",
      // pathName: "View Queue",
      color: "gold",
      noSign: true,
    },
    {
      type:"wallet",
      walletType: "Total Credit",
      walletBalance: overviewDetails?.total_credit,
      // pathName: "View History",
      color: "lightGreen",
      noSign: true,
    },
    {
      type:"wallet",
      walletType: "Total Debit",
      walletBalance: overviewDetails?.total_transaction,
      path: "/admin/transactions",
      pathName: "View History",
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="grid lg:grid-cols-2 lg:grid-rows-2 grid-cols-1 gap-4">
          {topWallets.map((wallet, index) => (
            <OverviewCard details={wallet} key={index} />
          ))}
        </div>
        <div className="space-y-4 mt-6">
          <Commissions />
        </div>
        <div className="w-full mt-4">
          <div className="w-full lg:mx-0 mx-auto">
            <AnnouncementCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
