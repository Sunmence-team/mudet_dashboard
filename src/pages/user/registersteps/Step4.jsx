import React, { useEffect } from "react";

const Step4 = ({ prevStep, nextStep, formData = {}, updateFormData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Sponsor Input</p>
        <div className="w-full grid grid-cols-3 gap-y-8">
          <div className="flex flex-col gap-1 text-sm md:text-xl ">
            <p className="font-medium">Product</p>
            <p className="font-semibold">{formData.package || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">Sponsor</p>
            <p className="font-semibold">{formData.sponsor || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">BV</p>
            <p className="font-semibold">
              {formData.package
                ? {
                    "Lunch Package": "10",
                    "Ignite Package": "30",
                    "Momentum Package": "80",
                    "Power Package": "200",
                    "Scale Package": "500",
                    "Turbo Package": "700",
                    "Legend Package": "1000",
                  }[formData.package.split(" ")[0]] || "Not provided"
                : "Not provided"}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">Product</p>
            <p className="font-semibold">{formData.package || "Not provided"}</p>
          </div>
        </div>
        <div className="border border-black/10"></div>
        <div className="flex justify-end">
          <p className="text-xl md:text-2xl font-semibold">
            Total Amount{" "}
            <span>
              {formData.package
                ? {
                    "Lunch Package": "14,000",
                    "Ignite Package": "28,000",
                    "Momentum Package": "70,000",
                    "Power Package": "182,000",
                    "Scale Package": "406,000",
                    "Turbo Package": "700,000",
                    "Legend Package": "1,050,000",
                  }[formData.package] || "Not provided"
                : "Not provided"}{" "}
              NGN
            </span>
          </p>
        </div>
      </div>
      <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Sponsor Input</p>
        <div className="w-full grid grid-cols-3 gap-y-8">
          <div className="flex flex-col gap-1 text-sm md:text-xl ">
            <p className="font-medium">First Name</p>
            <p className="font-semibold">{formData.first_name || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">Last Name</p>
            <p className="font-semibold">{formData.last_name || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">Gender</p>
            <p className="font-semibold">{formData.gender || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">Country</p>
            <p className="font-semibold">{formData.country || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">State</p>
            <p className="font-semibold">{formData.state || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">City</p>
            <p className="font-semibold">{formData.city || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">Email</p>
            <p className="font-semibold">{formData.email || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">Number</p>
            <p className="font-semibold">{formData.mobile || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">Date of Birth</p>
            <p className="font-semibold">{formData.date_of_birth || "Not provided"}</p>
          </div>
        </div>
      </div>
      <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
        <p className="text-xl md:text-2xl font-semibold">Sponsor Input</p>
        <div className="w-full flex justify-between">
          <div className="flex flex-col gap-1 text-sm md:text-xl ">
            <p className="font-medium">Username</p>
            <p className="font-semibold">{formData.username || "Not provided"}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm md:text-xl">
            <p className="font-medium">Password</p>
            <p className="font-semibold">{formData.password ? "*".repeat(formData.password.length) : "Not provided"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4;