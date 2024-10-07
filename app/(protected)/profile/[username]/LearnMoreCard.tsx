import React from "react";
import Image from "next/image";

interface Props {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const LearnmoreCard = ({
  title,
  description,
  buttonText,
  onButtonClick,
}: Props) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
      <div className="flex items-center mb-4">
        <span className="text-2xl md:text-3xl font-black">Learn</span>
        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 md:mt-3"></span>
      </div>
      <div className="flex justify-center mb-4">
        <Image
          src="/path-to-your-center-image.svg"
          alt="Learn illustration"
          width={120}
          height={120}
        />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={onButtonClick}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default LearnmoreCard;
