import React from "react";
import { auth } from "@/auth";

const SettingsPage = async () => {
  const session = await auth();

  return (
    <div>
      <h1 className="font-bold text-2xl">Settings Page</h1>
    </div>
  );
};

export default SettingsPage;
