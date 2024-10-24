import { useState, useTransition } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import ModalDescription from "./ModalDescription";
import { LoginSchema } from "@/schemas";
import FormError from "./FormError";
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

type FormData = z.infer<typeof LoginSchema>;

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  switchToSignup: () => void;
}

const SignInModal = ({ isOpen, onClose, switchToSignup }: SignInModalProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors , isValid},
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");

    startTransition(async () => {
      try {
        const result = await login(data);
          if (result?.error) {
            setError(result.error);
          } else if (result?.success) {
            toast.success(result.success);
            reset()
            // onClose();
          } else {
            onClose();
            router.refresh();
          }
      } catch (error) {
        setError("An unexpected error occurred");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  const toggleEmailForm = () => {
    setShowEmailForm(!showEmailForm);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] md:h-[650px] md:max-w-4xl xl:max-w-5xl p-0 border-none">
        <div className="grid md:grid-cols-2">
          <ModalDescription />
          <div className="p-4 sm:p-7">
            {showEmailForm && (
              <button
                onClick={toggleEmailForm}
                className="text-xl font-bold text-gray-900 dark:text-white mb-4"
              >
                ← Back
              </button>
            )}
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Sign In
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                Don&apos;t have an account yet?
                <button
                  className="text-gray-700 decoration-2 hover:underline font-medium"
                  onClick={() => {
                    onClose();
                    switchToSignup();
                  }}
                >
                  Join here
                </button>
              </p>
            </div>

            <div className="mt-5 space-y-6">
              {!showEmailForm ? (
                <div>
                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full"
                  >
                    <svg
                      className="w-4 h-auto mr-2"
                      viewBox="0 0 46 47"
                      fill="none"
                    >
                      <path
                        d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                        fill="#34A853"
                      />
                      <path
                        d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                        fill="#EB4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={toggleEmailForm}
                    variant="outline"
                    className="w-full"
                  >
                    Continue with Email/Username
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        disabled={isPending}
                        type="email"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          className="text-sm text-green-600 hover:underline"
                          href="#"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        disabled={isPending}
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-sm text-red-500">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {error && <FormError message={error} />}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || !isValid}
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
