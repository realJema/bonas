

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EmailConfirm() {
  const [showAnimation, setShowAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
      <div
        className={`text-center mb-8 transition-all duration-1000 ease-out ${
          showAnimation
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-4"
        }`}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Account Confirmed!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your account has been successfully verified.
        </p>
        <Button
          className="w-full max-w-xs"
          size="lg"
          onClick={() => router.replace("/")}
        >
          Go to Home Page
        </Button>
      </div>
    </div>
  );
}
