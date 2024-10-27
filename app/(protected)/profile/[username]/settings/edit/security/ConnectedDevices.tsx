"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ConnectedDevices = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-bold mb-4 text-gray-400">CONNECTED DEVICES</h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 18H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">
                Chrome 129, Windows{" "}
                <span className="text-green-500">THIS DEVICE</span>
              </h3>
              <p className="text-sm text-gray-600">
                Last Activity 12 minutes ago • Buea, SW, Cameroon
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="hover:bg-green-500 hover:text-white"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedDevices;
