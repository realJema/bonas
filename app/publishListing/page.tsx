"use client";

import { useState } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import FinalStep from "./components/FinalStep";
import SuccessPage from "./components/SuccessPage";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    address: "",
    town: "",
    timeline: "",
    budget: "",
  });
  const [isPublished, setIsPublished] = useState(false);

  const handleContinue = (data: { [key: string]: any }) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handlePublish = () => {
    setIsPublished(true);
  };

  const handleReview = () => {
    setIsPublished(false);
    setCurrentStep(1);
  };

  const steps = [
    "Share brief description",
    "Categories & Location",
    "Add timeline and budget",
    "Publish",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm h-auto md:h-[70px] py-4 md:py-0 flex items-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          {/* Bonas Logo */}
          <div
            className="text-2xl font-bold mb-4 md:mb-0 md:mr-8 text-black"
            style={{ width: "100px" }}
          >
            Bonas<span className="text-[#1dbf73]">.</span>
          </div>

          {/* Breadcrumb Navigation */}
          {!isPublished && (
            <nav className="flex-grow mb-4 md:mb-0">
              <ol className="flex items-center justify-center md:justify-start space-x-2 md:space-x-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-center">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${
                        currentStep === index + 1
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`hidden lg:inline ml-2 font-bold text-sm
                      ${
                        currentStep === index + 1
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                    {index < 3 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="hidden lg:inline h-5 w-5 mx-2 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Exit Button */}
          <button className="text-[15px] text-gray-800 hover:underline" onClick={() => window.location.href = '/'}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isPublished ? (
          <SuccessPage onReview={handleReview} />
        ) : (
          <>
            {currentStep === 1 && (
              <Step1 onContinue={handleContinue} formData={formData} />
            )}
            {currentStep === 2 && (
              <Step2
                onContinue={handleContinue}
                onBack={handleBack}
                formData={formData}
              />
            )}
            {currentStep === 3 && (
              <Step3
                onContinue={handleContinue}
                onBack={handleBack}
                formData={formData}
              />
            )}
            {currentStep === 4 && (
              <FinalStep
                formData={formData}
                onBack={handleBack}
                onPublish={handlePublish}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
