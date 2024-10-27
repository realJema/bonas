"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { VolumeIcon, HelpCircle } from "lucide-react";
import CustomSwitch from "./CustomSwitch";

const RealTimeNotifications = () => {
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-500 flex items-center">
              REAL-TIME NOTIFICATIONS
              <HelpCircle className="ml-2 h-5 w-5 text-gray-400 cursor-help" />
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                Enable/disable real-time notifications
              </div>
              <div className="flex items-center">
                <CustomSwitch
                  checked={realTimeEnabled}
                  onCheckedChange={setRealTimeEnabled}
                />
                <span className="ml-2 text-sm text-blue-500 cursor-pointer hover:underline">
                  Try Me!
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                Enable/disable sound
              </div>
              <div className="flex items-center">
                <CustomSwitch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
                <VolumeIcon className="ml-2 h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="flex justify-end items-start mt-4 md:mt-0">
            <Button className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeNotifications;
