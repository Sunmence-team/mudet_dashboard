import React, { useEffect, useState } from "react";
import api from "../../utilities/api";
import LazyLoader from "../LazyLoader";

const MembersCard = () => {
  const [newMembers, setNewMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchNewMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/referrals/sponsoredDownlines");
      if (res.status === 200) {
        const resData = res?.data?.data?.downlines;
        const userToDisPlay = resData.filter((user) => {
          return user.relationship_type === "sponsored";
        });
        setNewMembers(userToDisPlay);
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

  function formatDate(rawDate) {
    const date = new Date(rawDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  }

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
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/30 text-primary font-bold">
                  {member?.user?.fullname

                    ?.split(" ")
                    ?.map((n) => n[0])
                    ?.join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-black">
                    {member?.user?.fullname}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {member?.user?.username}
                  </p>
                </div>
              </div>
              <span className="lg:text-base font-semibold text-sm text-black">
                {formatDate(member?.created_at)}
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
