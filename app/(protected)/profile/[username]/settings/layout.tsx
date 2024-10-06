import React from "react";
import { PropsWithChildren } from "react";

const SettingsPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <main className="container mx-auto px-5 md:px-4 md:max-w-7xl">
        {children}
      </main>
    </>
  );
};

export default SettingsPageLayout;
