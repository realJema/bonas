import { auth } from "@/auth";
import { formatUsername } from "@/utils/formatUsername";
import React, { PropsWithChildren } from "react";
import SettingsPageSidebar from "../SettingsPageSidebar";

const Layout = async ({ children }: PropsWithChildren) => {
  const session = await auth();
  const formattedUsername = formatUsername(session!.user!.name);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <SettingsPageSidebar username={formattedUsername} />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
