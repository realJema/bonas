import React from "react";
import { auth } from "@/auth";
import Header from "./Header";
import { formatUsername } from "@/utils/formatUsername";
import { Loader } from "lucide-react";

const SettingsPage = async () => {
  const session = await auth();
  const formattedUsername = formatUsername(session!.user.name);

  return (
    <>
      <Header username={formattedUsername} />
      <h1 className="font-bold text-2xl">Settings Page </h1>
    </>
  );
};

export default SettingsPage;


