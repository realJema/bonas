"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface FormData {
  name: string;
  email: string;
  onlineStatus: string;
}

interface Props {
  initialData: {
    name: string;
    email: string;
    onlineStatus: string;
  };
}

const UserAccountEditForm = ({ initialData }: Props) => {
  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      onlineStatus: initialData.onlineStatus,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="shadow-sm">
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <Label
              htmlFor="name"
              className="text-xs font-semibold text-gray-500"
            >
              NAME
            </Label>
            <Input
              id="name"
              {...register("name")}
              className="border-gray-300 md:col-span-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-gray-500"
            >
              EMAIL
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="bg-gray-100 md:col-span-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <Label
                htmlFor="onlineStatus"
                className="text-xs font-semibold text-gray-500 flex items-center group"
              >
                ONLINE STATUS
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
              </Label>
              <p className="text-xs text-gray-500 mt-1 group-hover:text-green-500">
                When online, your Gigs are visible under the Online seller
                filter.
              </p>
            </div>
            <div className="md:col-span-2">
              <Select
                onValueChange={(value) => setValue("onlineStatus", value)}
                defaultValue={initialData.onlineStatus}
              >
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="GO OFFLINE FOR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">1 HOUR</SelectItem>
                  <SelectItem value="1day">1 DAY</SelectItem>
                  <SelectItem value="1week">1 WEEK</SelectItem>
                  <SelectItem value="forever">FOREVER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end w-full">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default UserAccountEditForm;
