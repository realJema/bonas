import React from "react";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoIcon } from "lucide-react";
import UserAccountEditForm from "./UserAccountEditForm";

const AccountEditPage = async () => {
  const session = await auth();

  const initialData = {
    name: session?.user?.name ? session.user.name.toUpperCase() : "",
    email: session?.user?.email || "",
    onlineStatus: "online",
  };

  return (
    <Card className="p-6 py-10 space-y-6 w-full md:max-w-5xl mx-auto my-6">
      <div className="flex justify-end ">
        <div className="flex items-center gap-0">
          <h1>Need to update your public profile?</h1>
          <Button variant="link" className="text-green-500">
            Go to My Profile
          </Button>
        </div>
      </div>

      <UserAccountEditForm initialData={initialData} />

      <Card className="shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <CardTitle className="text-xs font-semibold text-gray-500">
                ACCOUNT DEACTIVATION
              </CardTitle>
            </div>
            <div>
              <Label
                htmlFor="deactivationReason"
                className="text-sm font-semibold block mb-2"
              >
                I&apos;m leaving because...
              </Label>
              <Select>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Choose a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reason1">Reason 1</SelectItem>
                  <SelectItem value="reason2">Reason 2</SelectItem>
                  <SelectItem value="reason3">Reason 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center">
              What happens when you deactivate your account?
              <InfoIcon className="h-5 w-5 text-gray-400 ml-2" />
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>
                Your profile and Gigs won&apos;t be shown on Fiverr anymore.
              </li>
              <li>Active orders will be cancelled.</li>
              <li>You won&apos;t be able to re-activate your Gigs.</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-100"
          >
            Deactivate Account
          </Button>
        </div>
      </Card>
    </Card>
  );
};

export default AccountEditPage;
