"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const TwoFactorAuthentication = () => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          {/* Left side */}
          <div className="w-full sm:w-auto">
            <h2 className="font-bold text-gray-400 uppercase">
              TWO FACTOR AUTHENTICATION
            </h2>
            <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              RECOMMENDED
            </span>
          </div>

          {/* Right side */}
          <div className="w-full sm:w-[510px]">
            <Switch className="mb-2 sm:ml-auto" />
            <p className="text-sm text-gray-600 mt-2 sm:mt-1 md:w-[510px] sm:ml-auto">
              To help keep your account secure, we&apos;ll ask you to submit a
              code when using a new device to log in. We&apos;ll send the code
              via SMS, email, or Bonas notification.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuthentication;
