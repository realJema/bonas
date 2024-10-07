"use client";

import React, { useState } from "react";
import CustomCheckbox from "./CustomCheckbox";

const notificationTypes = [
  "Inbox Messages",
  "Order Messages",
  "Order Updates",
  "Rating Reminders",
  "Buyer Briefs",
];

const Notifications = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(notificationTypes.map((type) => [type, true]))
  );

  const handleCheckboxChange = (type: string) => {
    setCheckedItems((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-500 mb-2">
            NOTIFICATIONS
          </h2>
          <p className="text-sm font-medium text-gray-600 mb-2">
            For important updates regarding your Fiverr activity, certain
            notifications cannot be disabled.
          </p>
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Type</h3>
              {notificationTypes.map((type, index) => (
                <div key={index} className="text-sm text-gray-600 py-2">
                  {type}
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2 text-right">
                Email
              </h3>
              {notificationTypes.map((type, index) => (
                <div key={index} className="flex justify-end py-2">
                  <CustomCheckbox
                    checked={checkedItems[type]}
                    onCheckedChange={() => handleCheckboxChange(type)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;