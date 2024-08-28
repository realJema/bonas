"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ArrowRight, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function EmailConfirm() {
  const [showAnimation, setShowAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-4">
      <div
        className={`text-center mb-8 transition-all duration-1000 ease-out ${
          showAnimation
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-4"
        }`}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Account Confirmed!
        </h1>
      </div>

      <Card
        className={`w-full max-w-md transition-all duration-1000 ease-out ${
          showAnimation
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-4"
        }`}
      >
        <CardHeader>
          <CardTitle>Welcome Aboard!</CardTitle>
          <CardDescription>
            Your account has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Congratulations! You&apos;ve completed the account creation process.
            You can now access all features of our platform.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm font-medium text-green-800">
              What&apos;s next?
            </p>
            <ul className="mt-2 text-sm text-green-700 list-disc list-inside">
              <li>Log in to your account</li>
              <li>Complete your profile</li>
              <li>Explore our features</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" size="lg" onClick={() => router.push('/')}>
             Click here to find the Login button
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <Link href="#" className="flex items-center hover:text-gray-700">
              <Settings className="mr-1 h-4 w-4" />
              Account Settings
            </Link>
            <Link href="#" className="flex items-center hover:text-gray-700">
              <HelpCircle className="mr-1 h-4 w-4" />
              Help Center
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
