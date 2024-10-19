"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordChangeForm = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-400">
          CHANGE PASSWORD
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="mb-1 sm:mb-0 sm:w-1/3 text-gray-500">
              Current Password
            </label>
            <Input
              type="password"
              className="w-full sm:w-2/3"
              {...register("currentPassword")}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="mb-1 sm:mb-0 sm:w-1/3 text-gray-500">
              New Password
            </label>
            <Input
              type="password"
              className="w-full sm:w-2/3"
              {...register("newPassword")}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start">
            <label className="mb-1 sm:mb-0 sm:w-1/3 text-gray-500 sm:pt-2">
              Confirm Password
            </label>
            <div className="w-full sm:w-2/3">
              <Input
                type="password"
                className="w-full"
                {...register("confirmPassword")}
              />
              <p className="text-sm text-gray-500 mt-1">
                8 characters or longer. Combine upper and lowercase letters and
                numbers.
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeForm;
