"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SignInModal from "./SignInModal";
import SignupModal from "./SignupModal";

interface Props {
  isAuthenticated: boolean;
}

const AuthButtons = ({ isAuthenticated }: Props) => {
  const [modalState, setModalState] = useState<"signin" | "signup" | null>(
    null
  );

  return (
    <>
      <button
        onClick={() => setModalState("signin")}
        className="flex whitespace-nowrap text-gray-600 gap-2 items-center hover:text-green-500 font-semibold"
      >
        Sign In
      </button>
      <Button
        onClick={() => setModalState("signup")}
        variant="outline"
        className="flex sm:text-green-500 gap-2 items-center font-medium text-base hover:opacity-80 sm:hover:text-white sm:hover:bg-green-500 sm:border sm:border-green-500 px-3 py-1 rounded-sm"
      >
        Join
      </Button>
      <SignInModal
        isOpen={modalState === "signin"}
        onClose={() => setModalState(null)}
        switchToSignup={() => setModalState("signup")}
      />
      <SignupModal
        isOpen={modalState === "signup"}
        onClose={() => setModalState(null)}
        switchToSignin={() => setModalState("signin")}
      />
    </>
  );
};

export default AuthButtons;
