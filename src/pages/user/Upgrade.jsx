import React, { useState } from "react";
import { Link } from "react-router-dom";

const Upgrade = () => {
  const [currentPackage, setCurrentPackage] = useState({
    name: "Spark Package",
    pv: 20,
    price: 20000,
  });
  const [selectedPackage, setSelectedPackage] = useState("");
  const packages = [
    {
      name: "Lunch Package",
      nameBgColor: "bg-primary",
      nameTextColor: "text-white",
      price: "14,000",
      pointValue: "10PV",
    },
    {
      name: "Ignite Package",
      nameBgColor: "bg-secondary",
      nameTextColor: "text-white",
      price: "28,000",
      pointValue: "30PV",
    },
    {
      name: "Momentum  Package",
      nameBgColor: "bg-primary",
      nameTextColor: "text-white",
      price: "70,000",
      pointValue: "80PV",
    },
    {
      name: "Power	 Package",
      nameBgColor: "bg-secondary",
      nameTextColor: "text-white",
      price: "182,000",
      pointValue: "200PV",
    },
    {
      name: "Scale Package",
      nameBgColor: "bg-primary",
      nameTextColor: "text-white",
      price: "406,000",
      pointValue: "500PV",
    },
    {
      name: "Turbo Package",
      nameBgColor: "bg-secondary",
      nameTextColor: "text-white",
      price: "700,000",
      pointValue: "700PV",
    },
    {
      name: "Legend Package",
      nameBgColor: "bg-primary",
      nameTextColor: "text-white",
      price: "1,050,000",
      pointValue: "1000PV",
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Current Package</h2>
        {currentPackage ? (
          <div className="p-8 flex justify-between w-full bg-primary text-white rounded-lg">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-medium">{currentPackage?.name}</h3>
              <p className="text-base font-medium">
                Point Value: {currentPackage?.pv}PV
              </p>
            </div>
            <div className="">
              <h2 className="text-3xl font-medium">
                {currentPackage.price?.toLocaleString()}
                <span className="text-sm">NGN</span>
              </h2>
            </div>
          </div>
        ) : (
          <div>
            <p>Seem's you are not registered on any package yet</p>
            <Link
              to={"/user/products"}
              className="bg-primary text-white font-medium py-2 px-6 rounded-full hover:bg-primary/90 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
      <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-7 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">
          Choose a package to upgrade
        </p>
        <div className="w-full overflow-x-auto mt-8 styled-scrollbar">
          <div className="flex gap-6 min-w-max">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`w-[270px] md:w-[300px] border border-black/10 flex flex-col rounded-2xl ${
                  selectedPackage === pkg.name ? "border-primary" : ""
                }`}
                onClick={() => setSelectedPackage(pkg.name)}
              >
                <div
                  className={`w-full h-18 ${
                    pkg.name.includes("Package") ? "bg-primary" : "bg-secondary"
                  } rounded-t-2xl flex items-center justify-center text-white text-center`}
                >
                  <p className="text-xl md:text-2xl font-bold">{pkg.name}</p>
                </div>
                <div className="py-6 flex flex-col gap-4 items-center justify-center">
                  <p className="text-3xl md:text-4xl font-bold">
                    {pkg.price}
                    <span className="text-sm font-light text-black/50">
                      NGN
                    </span>
                  </p>
                  <p className="text-black/70 text-[12px]">
                    Point Value: {pkg.pointValue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="bg-primary w-fit flex jsutify-end py-3 px-8 cursor-pointer flex-row-reverse text-white rounded-lg" disabled={selectedPackage  === "" ? true :false}>
          Upgrade
        </button>
      </div>
    </div>
  );
};

export default Upgrade;
