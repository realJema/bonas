import { auth } from "@/auth";
import { formatUsername } from "@/utils/formatUsername";
import React, { PropsWithChildren } from "react";
import Header from "./Header";

const Layout = async ({ children }: PropsWithChildren) => {
  const session = await auth();
  const formattedUsername = formatUsername(session!.user!.name);

  return (
    <>
      <Header username={formattedUsername} />
      <main className="container mx-auto px-4 md:px-0 md:max-w-7xl">
        {children}
      </main>
    </>
  );
};

export default Layout;
