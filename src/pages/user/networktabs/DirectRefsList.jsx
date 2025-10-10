import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";
import PaginationControls from "../../../utilities/PaginationControls";
import {
  formatISODateToCustom,
  formatterUtility,
} from "../../../utilities/formatterutility";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/loaders/LazyLoader";

const DirectRefsTable = () => {
  const { user, token, logout } = useUser();
  const [directlySponsored, setDirectlySponsored] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const fetchirectlySponsoredlist = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/referrals/sponsoredDownlines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          perPage: perPage,
        },
      });

      // console.log("user directly sponsored list:", response);

      if (response.status === 200 && response.data.success) {
        const { downlines, current_page, last_page, per_page } =
          response.data.data;
        setDirectlySponsored(downlines);
        setCurrentPage(current_page);
        setLastPage(last_page);
        setPerPage(per_page);
      } else {
        throw new Error(
          response.data.message ||
            "Failed to fetch user directly sponsored list."
        );
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
      }
      console.error("API submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred fetching user directly sponsored list!."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchirectlySponsoredlist();
  }, [user?.id, token, currentPage]);

  const filteredData = directlySponsored.filter(
    (direct) => direct.relationship_type === "sponsored"
  );

  // const filteredData = [
  //     {
  //         user: {
  //             fullname: "Ade Favour",
  //             username: "Ade Favour",
  //             rank: "",
  //         },
  //         plan: {
  //             name: "Lunch",
  //             username: "Ade Favour",
  //         },
  //         created_at: "2024-10-08T13:45:78"
  //     },
  //     {
  //         user: {
  //             fullname: "Ade Favour",
  //             username: "Ade Favour",
  //             rank: "",
  //         },
  //         plan: {
  //             name: "Lunch",
  //             username: "Ade Favour",
  //         },
  //         created_at: "2024-10-08T13:45:78"
  //     },
  // ]

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-black/70 text-[12px] uppercase">
            <th className="ps-2 p-5 text-start">S/N</th>
            <th className="p-5 text-center">Full name</th>
            <th className="p-5 text-center">username</th>
            <th className="p-5 text-center">package</th>
            <th className="p-5 text-center">rank</th>
            <th className="pe-2 p-5 text-end">Date</th>
          </tr>
        </thead>
        <tbody className="space-y-4">
          {isLoading ? (
            <tr>
              <td colSpan="7" className="text-center p-8">
                <LazyLoader color={"green"} />
              </td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              const serialNumber = (currentPage - 1) * perPage + (index + 1);
              return (
                <tr
                  key={item?.user?.id}
                  className="bg-white rounded-xl text-sm text-center capitalize"
                >
                  <td className="p-3 text-start rounded-s-lg border-y border-s-1 border-black/10">
                    {String(index + 1).padStart(3, "0")}
                  </td>
                  <td className="p-4 border-y border-black/10">
                    {item?.user?.fullname || "-"}
                  </td>
                  <td className="p-4 border-y border-black/10">
                    {item?.user?.username || "-"}
                  </td>
                  <td className="p-4 border-y border-black/10 capitalize">
                    {item?.user?.plan?.name || "-"}
                  </td>
                  <td className="p-4 border-y border-black/10">
                    {item?.user?.rank ? item?.user?.rank : "No rank" || "-"}
                  </td>
                  <td className="p-4 text-end text-sm text-pryClr font-semibold border-e-1 rounded-e-lg border-y border-black/10">
                    {formatISODateToCustom(item.created_at)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-8">
                Directly sponsored list is empty.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!isLoading && directlySponsored.length > 0 && (
        <div className="flex justify-center items-center gap-2 p-4">
            <PaginationControls
                currentPage={currentPage}
                totalPages={lastPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
        )}
    </div>
  );
};

export default DirectRefsTable;
