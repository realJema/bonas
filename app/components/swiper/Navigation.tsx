import React from "react";

interface NavigationProps {
  containerStyles?: string;
  styles?: string;
  bg?: string;
  svgSize?: string;
  onPrev: () => void;
  onNext: () => void;
  isBeginning: boolean;
  isEnd: boolean;
}

const Navigation = ({
  containerStyles,
  onPrev,
  onNext,
  styles,
  bg = "bg-gray-50",
  svgSize = "h-4 w-4",
  isBeginning,
  isEnd,
}: NavigationProps) => {
  return (
    <div className={`flex items-center gap-3 ${containerStyles} z-20`}>
      <button
        className={`prev-button z-20 bg-gray-50 bg-opacity-75 transition-colors hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center shadow-md ${
          isBeginning ? "opacity-40 cursor-text" : ""
        } ${styles}`}
        onClick={onPrev}
        disabled={isBeginning}
      >
        <svg
          width="8"
          height="15"
          className={`${svgSize} text-gray-600`}
          viewBox="0 0 8 15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.2279 0.690653L7.84662 1.30934C7.99306 1.45578 7.99306 1.69322 7.84662 1.83968L2.19978 7.5L7.84662 13.1603C7.99306 13.3067 7.99306 13.5442 7.84662 13.6907L7.2279 14.3094C7.08147 14.4558 6.84403 14.4558 6.69756 14.3094L0.153374 7.76518C0.00693607 7.61875 0.00693607 7.38131 0.153374 7.23484L6.69756 0.690653C6.84403 0.544184 7.08147 0.544184 7.2279 0.690653Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <button
        onClick={onNext}
        className={`next-button z-20 bg-gray-50 bg-opacity-75 transition-colors hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center shadow-md ${
          isEnd ? "opacity-40 cursor-text" : ""
        } ${styles}`}
        disabled={isEnd}
      >
        <svg
          width="8"
          height="15"
          className="h-4 w-4 text-gray-600"
          viewBox="0 0 8 15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.772102 14.3093L0.153379 13.6906C0.00694026 13.5442 0.00694026 13.3067 0.153379 13.1603L5.80022 7.5L0.153379 1.83967C0.00694026 1.69323 0.00694026 1.45577 0.153379 1.30931L0.772102 0.690585C0.918534 0.544151 1.15598 0.544151 1.30242 0.690585L7.84661 7.23482C7.99307 7.38125 7.99307 7.61869 7.84661 7.76516L1.30242 14.3093C1.15598 14.4558 0.918534 14.4558 0.772102 14.3093Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

export default Navigation;
