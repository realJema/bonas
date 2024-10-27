import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import PasswordChangeForm from "./PasswordChangeForm";
import ConnectedDevices from "./ConnectedDevices";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import PhoneVerification from "./PhoneVerification";
import SecurityQuestion from "./SecurityQuestion";

const SecurityEditPage = () => {
  return (
    <div className="w-full md:max-w-4xl lg:w-full mx-auto p-6">
      <div className="w-full">
        <PasswordChangeForm />

        <PhoneVerification />

        <SecurityQuestion />

        <TwoFactorAuthentication />

        <ConnectedDevices />
      </div>
    </div>
  );
};

export default SecurityEditPage;
