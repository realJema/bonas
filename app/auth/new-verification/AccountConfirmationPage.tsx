"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verificatition";
import { toast } from "react-toastify";
import EmailConfirm from "./EmailConfirm";
import * as Progress from "@radix-ui/react-progress";
import { signIn } from "next-auth/react";

const AccountConfirmationContent = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const verificationAttempted = useRef(false);
  const [email, setEmail] = useState<string | undefined>();

  const token = searchParams.get("token");
  const onSubmit = useCallback(() => {
    // Retrieve the password from the local storage
    const password = localStorage.getItem("password");

    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    if (!token) {
      setError("Missing token, try signing up again");
      setIsLoading(false);
      return;
    }

    setProgress(0);
    const interval = setInterval(
      () => setProgress((prev) => Math.min(prev + 10, 90)),
      100
    );

    newVerification(token, password!)
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else if (data.success) {
          toast.success("Verification Complete");
          // Delete the password from the local storage
          localStorage.removeItem("password");
        }
      })
      .catch((error) => {
        console.error("Verification error:", error);
        setError("Something went wrong!");
      })
      .finally(() => {
        clearInterval(interval);
        setIsLoading(false);
        setProgress(100);
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <Progress.Root
          className="relative overflow-hidden bg-gray-200 rounded-full w-56 h-6"
          style={{ transform: "translateZ(0)" }}
          value={progress}
        >
          <Progress.Indicator
            className="bg-green-500 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
            style={{ transform: `translateX(-${100 - progress}%)` }}
          />
        </Progress.Root>
        <p className="mt-4 text-lg text-gray-600">Verifying...</p>
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  return <EmailConfirm />;
};

export default AccountConfirmationContent;
