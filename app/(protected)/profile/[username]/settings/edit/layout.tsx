import { auth } from "@/auth";
import { formatUsername } from "@/utils/formatUsername";
import React, { PropsWithChildren } from "react";
import SettingsPageSidebar from "../SettingsPageSidebar";

const Layout = async ({ children }: PropsWithChildren) => {
  const session = await auth();
  const formattedUsername = formatUsername(session!.user!.name);

  return (
    <div className="flex flex-col md:flex-row min-h-screen container mx-auto px-5 md:px-4 md:max-w-7xl">
      <SettingsPageSidebar username={formattedUsername} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
