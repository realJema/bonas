import Link from "next/link";
import React from "react";
import VerifyButton from "./VerifyButton";

const BusinessInformationEditPage = () => {
  return (
    <div className="bg-white flex-col space-y-6 p-8 mt-6 rounded-md">
      <div className="flex-col space-y-2">
        <h1 className="text-black text-xl font-semibold">
          Personal & business information
        </h1>
        <p>
          Verify your personal and business information for compliance purposes.
          <Link href="#" className="underline inline-block">
            Learn more
          </Link>
        </p>
      </div>
      <VerifyButton />
    </div>
  );
};

export default BusinessInformationEditPage;
