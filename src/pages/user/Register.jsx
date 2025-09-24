import React, { useState, useRef, useEffect } from "react";
import Step1 from "../steps/Step1";
import Step2 from "../steps/Step2";
import Step3 from "../steps/Step3";
import Step4 from "../steps/Step4";
import Step5 from "../steps/Step5";

const steps = [
  "Initial Registration",
  "Personal Information",
  "Login Information",
  "Overview",
  "Payment",
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const progressRef = useRef(null);
  const stepRefs = useRef([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const nextStep = () => {
    if (currentStep < steps.length && isFormValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const updateFormData = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  const setFormValidity = (valid) => {
    setIsFormValid(valid);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} setFormValidity={setFormValidity} />;
      case 2:
        return <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} setFormValidity={setFormValidity} />;
      case 3:
        return <Step3 nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} setFormValidity={setFormValidity} />;
      case 4:
        return <Step4 nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step5 nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (progressRef.current && stepRefs.current[currentStep - 1]) {
      const isSmallScreen = window.innerWidth < 640;
      if (isSmallScreen) {
        stepRefs.current[currentStep - 1].scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentStep]);

  return (
    <div className="w-full mx-auto">
      <div className="w-full flex flex-col">
        <h2 className="text-xl font-semibold">Register</h2>
        <div
          ref={progressRef}
          className="flex items-center w-full relative overflow-x-auto overflow-y-hidden h-[80px] scrollbar-hide"
          style={{ maxWidth: "100vw" }}
        >
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;

            return (
              <div
                key={index}
                ref={(el) => (stepRefs.current[index] = el)}
                className={`flex items-center flex-1 relative px-4 py-2 min-w-[180px]
                  ${isCompleted || isActive ? "bg-primary text-white" : "bg-primary/40 text-gray-500"}
                  ${index === 0 ? "rounded-l-full" : ""}
                  ${index === steps.length - 1 ? "rounded-r-full" : ""}
                `}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 absolute top-1/2 -translate-y-1/2
                    ${isCompleted || isActive ? "border-primary text-primary bg-white" : "border-green-300 text-gray-500 bg-white"}
                    ${index === 0 ? "left-0" : "-ml-6"}
                  `}
                >
                  <span className="text-base font-bold">{stepNumber}</span>
                </div>
                <span className="ml-10 text-xs font-medium whitespace-nowrap">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-6">{renderStep()}</div>
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length || !isFormValid}
          className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Register;