"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PhoneVerification = () => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:gap-10 lg:gap-0 justify-between items-start">
          <h2 className="font-medium text-gray-500 mb-2 sm:mb-0">
            PHONE VERIFICATION
          </h2>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 lg:gap-20 w-full sm:w-auto">
            <div>
              <p className="text-sm text-gray-600 w-full  xl:w-[510px]">
                Your phone is verified with Obilli. Click Edit to change your
                phone number
              </p>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneVerification;
