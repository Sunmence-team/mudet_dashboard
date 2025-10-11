import React, { useEffect, useState } from "react";
import OverviewCard from "../../components/cards/OverviewCard";
import AnnouncementCard from "../../components/cards/AnnouncementCard";
import { useUser } from "../../context/UserContext";
import api from "../../utilities/api";
import { toast } from "sonner";
import CommisionCard from "../../components/cards/CommisionCard";

const AdminOverview = () => {
  const { user, token } = useUser();
  const [overviewDetails, setOverviewDetails] = useState(null)
  const [commissionDetails, setCommissionDetails] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [isFetchingCommissions, setIsFetchingCommissions] = useState(false)

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

  const fetchCommissions = async () => {
    setIsFetchingCommissions(true)
    try {
      const response = await api.get(`/api/bottle_commission`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      console.log("commission response", response)

      if (response.status === 200) {
        setCommissionDetails(response.data.commissions.data)
      } else {
        throw new Error(response.data.message || "Failed to get overview data.");
      }
      
    } catch (error) {
      console.error("An error occured fetching overview data", error)
      toast.error("An error occured fetching overview data")
    } finally {
      setIsFetchingCommissions(false)
    }
  }

  useEffect(() => {
    fetchOverviewDetails()
    fetchCommissions()
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

  const commissions = [
    {
      user: commissionDetails[0]?.user, 
      total_amount: commissionDetails[0]?.total_amount, 
      total_transactions: commissionDetails[0]?.total_transactions
    },
    {
      user: commissionDetails[1]?.user, 
      total_amount: commissionDetails[1]?.total_amount, 
      total_transactions: commissionDetails[1]?.total_transactions
    },
    {
      user: commissionDetails[2]?.user, 
      total_amount: commissionDetails[2]?.total_amount, 
      total_transactions: commissionDetails[2]?.total_transactions
    },
    {
      user: commissionDetails[3]?.user, 
      total_amount: commissionDetails[3]?.total_amount, 
      total_transactions: commissionDetails[3]?.total_transactions
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="grid lg:grid-cols-2 lg:grid-rows-2 grid-cols-1 gap-4">
          {topWallets.map((wallet, index) => (
            <OverviewCard details={wallet} key={index} />
          ))}
        </div>
        <div className="space-y-4 mt-6">
          <h3 className="text-3xl font-semibold tracking-tight">Commisions Summary</h3>
          <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
            {commissions.map((commission, index) => (
              <CommisionCard details={commission} index={index} key={index} isLoading={isFetchingCommissions} />
            ))}
          </div>
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
