import React from "react";

const Heading = ({ label, styles }: { label: string; styles?: string }) => {
  return (
    <h2
      className={`text-xl opacity-90 md:text-2xl lg:text-[25px] font-semibold ${styles} line-clamp-1`}
    >
      {label}
    </h2>
  );
};

export default Heading;
