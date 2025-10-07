import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utilities/api";
import { Loader2 } from "lucide-react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { toast } from "sonner";

const Upgrade = () => {
  const [currentPackage, setCurrentPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [stockists, setStockists] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedStockist, setSelectedStockist] = useState("");
  const [fetchingPackage, setFetchingPackage] = useState(false);
  const [fetchingStokist, setFetchingStokist] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const { user } = useUser();
  const miscellaneousDetails = JSON.parse(
    localStorage.getItem("miscellaneousDetails")
  );
  const fetchPackages = async () => {
    setFetchingPackage(true);
    try {
      const response = await api.get("/api/plans/all");
      setPackages(response.data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingPackage(false);
    }
  };

  const fetchStokists = async () => {
    setFetchingStokist(true);
    try {
      const response = await api.get("/api/stockists");
      setStockists(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingStokist(false);
    }
  };

  const handleConfirmModal = () => {
    setShowModal(true);
    fetchStokists();
  };

  const handleConfirmUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await api.post("/api/upgrade-plan", {
        user_id: +user.id,
        upgrade_plan_id: +selectedPackage,
        stockist_id: +selectedStockist,
      });
      console.log(res);
      if (res.status === 200) {
        toast.success("Package Upgraded successfully");
        setShowModal(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          "An unexpected error occurred while upgrading package. " +
            error?.response?.data?.error ||
            error?.message ||
            "Please try again later."
        );
        console.error("Error during upgrading package:", error);
      }
    } finally {
      setUpgrading(false);
    }
  };

  useEffect(() => {
    setCurrentPackage(miscellaneousDetails.planDetails);
    fetchPackages();
  }, []);

  const filterNonCurrentPackage = packages.filter(
    (pkg) => pkg?.id !== currentPackage?.id
  );

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Current Package */}
        <div className="flex flex-col gap-4">
          {currentPackage ? (
            <>
              <h2 className="text-xl lg:text-2xl font-semibold">
                Current Package
              </h2>
              <div className="p-4 lg:p-8 flex justify-between w-full bg-primary text-white rounded-lg">
                <div className="flex flex-col gap-3">
                  <h3 className="text-base lg:text-2xl font-medium">
                    {currentPackage?.name}
                  </h3>
                  <p className="text-xs lg:text-base lg:font-medium">
                    Point Value: {currentPackage?.point_value}PV
                  </p>
                </div>
                <div>
                  <h2 className="text-base lg:text-3xl font-medium">
                    {Number(currentPackage.price)?.toLocaleString()}
                    <span className="text-[10px] lg:text-sm">NGN</span>
                  </h2>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col w-full items-center gap-4 h-[60vh] justify-center">
              <p className="text-xl font-medium">
                Seem's you are not registered on any package yet
              </p>
              <Link
                to={"/user/register"}
                className="bg-primary text-white font-medium py-2 px-6 rounded-full hover:bg-primary/90 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Upgrade Section */}
        {currentPackage && (
          <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-7 rounded-lg">
            <p className="text-xl md:text-2xl font-semibold">
              Choose a package to upgrade
            </p>

            {/* Packages */}
            <div className="w-full overflow-x-auto mt-8 styled-scrollbar">
              <div className="flex gap-6 lg:flex-row flex-col min-w-max">
                {fetchingPackage ? (
                  <div className="flex flex-col items-center justify-center w-full">
                    <h2 className="text-xl font-medium">
                      Loading available packages...
                    </h2>
                    <Loader2 className="animate-spin" size={30} />
                  </div>
                ) : (
                  filterNonCurrentPackage.reverse().map((pkg, index) => (
                    <div
                      key={index}
                      className={`w-full cursor-pointer lg:w-[300px] md:w-[350px] border border-black/10 flex flex-col rounded-2xl ${
                        selectedPackage === pkg.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      {/* Header */}
                      <div
                        className={`w-full h-16 ${
                          pkg.name.includes("Package")
                            ? "bg-primary"
                            : "bg-secondary"
                        } rounded-t-2xl flex items-center justify-center text-white text-center`}
                      >
                        <p className="text-lg md:text-2xl font-bold">
                          {pkg.name}
                        </p>
                      </div>

                      {/* Body */}
                      <div className="py-6 flex flex-col gap-3 items-center justify-center">
                        <p className="text-2xl md:text-4xl font-bold">
                          {pkg.price}
                          <span className="text-sm font-light text-black/50">
                            {" "}
                            NGN
                          </span>
                        </p>
                        <p className="text-black/70 text-sm">
                          Point Value: {pkg.point_value}
                          PV{" "}
                        </p>

                        {/* Get Started button visible only on mobile */}
                        <button
                          className="bg-primary text-white px-4 py-2 rounded-lg mt-2 block md:hidden"
                          onClick={() => setSelectedPackage(pkg.name)}
                        >
                          Get Started
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upgrade button - hidden on mobile */}
            <div className="flex lg:flex-row-reverse mt-4 md:flex">
              <button
                className="bg-primary w-full lg:w-fit py-3 px-8 cursor-pointer text-white rounded-lg"
                disabled={selectedPackage === ""}
                onClick={handleConfirmModal}
              >
                Upgrade
              </button>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">Confirm Upgrade</h2>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Package ID</label>
              <input
                type="text"
                value={+selectedPackage}
                disabled
                className="w-full border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
              />

              <label className="text-sm font-medium mt-2">
                Select Stockist
              </label>

              <select
                value={selectedStockist}
                onChange={(e) => setSelectedStockist(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="">
                  {fetchingStokist
                    ? "Fetching Stockists ID..."
                    : "-- Select Stockist ID --"}
                </option>
                {stockists.map((stk) => (
                  <option key={stk.id} value={stk.id}>
                    {stk.stockist}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                disabled={!selectedStockist || upgrading}
                onClick={handleConfirmUpgrade}
              >
                {!upgrading ? (
                  <span>Confirm</span>
                ) : (
                  <Loader2 className="animate-spin" size={19} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Upgrade;
