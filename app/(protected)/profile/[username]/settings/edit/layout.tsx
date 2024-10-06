import { auth } from "@/auth";
import { formatUsername } from "@/utils/formatUsername";
import React, { PropsWithChildren } from "react";
import SettingsPageSidebar from "../SettingsPageSidebar";

const Layout = async ({ children }: PropsWithChildren) => {
  const session = await auth();
  const formattedUsername = formatUsername(session!.user!.name);

  return (
    <div className="flex flex-col md:flex-row min-h-screen container mx-auto md:max-w-7xl">
      <SettingsPageSidebar username={formattedUsername} />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
