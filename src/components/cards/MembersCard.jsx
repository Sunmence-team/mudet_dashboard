import React, { useEffect, useState } from "react";
import api from "../../utilities/api";
import LazyLoader from "../LazyLoader";
import { formatDateToStyle, formatISODateToCustom, formatISODateToReadable } from "../../utilities/formatterutility";

const MembersCard = () => {
  const [newMembers, setNewMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNewMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/referrals/latest");
      console.log("res", res)
      if (res.status === 200) {
        const resData = res?.data?.data;
        setNewMembers(resData);
      } else {
        console.log("Failed to fetch new members");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      console.log(newMembers);
    }
  };

  useEffect(() => {
    fetchNewMembers(newMembers);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-5 mx-auto border-gray-300 border h-89">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">New Members</h2>
      <div className="styled-scrollbar space-y-4 max-h-65 overflow-y-auto">
        {loading ? (
          <LazyLoader />
        ) : newMembers?.length > 0 ? (
          newMembers.slice(0, 4).map((member, index) => (
            <div
              key={index}
              className="flex cursor-pointer justify-between items-start bg-white rounded-xl p-4 border border-gray-300 lg:w-[97%]"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/30 text-primary uppercase font-bold">
                  {member?.user?.fullname

                    ?.split(" ")
                    ?.map((n) => n[0])
                    ?.join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-black line-clamp-1">
                    {member?.user?.fullname}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {member?.user?.username}
                  </p>
                </div>
              </div>
              <span className="lg:text-base font-semibold text-sm text-black">
                {formatISODateToCustom(member?.user?.created_at).split(" ")[0]}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-4">
            No new member available
          </p>
        )}
      </div>
    </div>
  );
};

export default MembersCard;
