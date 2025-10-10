import React, { useEffect, useState } from "react";
import api from "../../utilities/api";
import LazyLoader from "../../components/LazyLoader";

const Newsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [fetching, setFetching] = useState(false);

  const fetchNewsletter = async () => {
    setFetching(true);
    try {
      const res = await api.get("/api/newsletter");
      const data = res?.data?.data?.data;
      setNewsletters(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNewsletter();
  }, []);

  return (
    <div className="">
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Newsletter Subscribers
          </h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Date Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan="3" className="text-center py-10">
                    <LazyLoader />
                  </td>
                </tr>
              ) : newsletters?.length > 0 ? (
                newsletters.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {String(index + 1).padStart(3, "0")}
                    </td>
                    <td className="py-3 px-4 text-gray-800">{item.email}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-8 text-gray-500 italic"
                  >
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Newsletters;
