import React from "react";
import Notifications from "./Notifications";
import RealTimeNotifications from "./RealTimeNotifications";

const NotificationsEditPage = () => {
  return (
    <div className="w-full md:max-w-4xl mx-auto p-6 bg-white mt-6">
      <Notifications />
      <hr className="my-8 border-gray-200" />
      <RealTimeNotifications />
    </div>
  );
};

export default NotificationsEditPage;
