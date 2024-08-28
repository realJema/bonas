"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';
import FullScreenLoader from "./Loader";
import EmailConfirm from "./EmailConfirm";
import { newVerification } from "@/actions/new-verificatition";
import { toast } from "react-toastify";

const AccountConfirmationContent = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const verificationAttempted = useRef(false);

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    if (!token) {
      setError("Missing token or email, try signing up again");
      setIsLoading(false);
      return;
    }

    try {
      newVerification(token)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
        })
        .catch((error) => {
          console.error("Verification error:", error);
          setError("Something went wrong!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Decryption error:", error);
      setError("Invalid email format");
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error) {
    toast.error(error);
  }

  return <EmailConfirm />;
};

const AccountConfirmationPage = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <AccountConfirmationContent />
    </Suspense>
  );
};

export default AccountConfirmationPage;
