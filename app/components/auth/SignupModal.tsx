import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
});

type FormData = z.infer<typeof schema>;

const SignupModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");

        // sign in the user
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          // If there's an error signing in, show it to the user
          setError(
            "Failed to sign in automatically. Please try signing in manually."
          );
          router.push("/api/auth/signin");
        } else {
          // If sign-in is successful, redirect to the home page
          router.push("/");
        }
      } else {
        setError(responseData.error || "An unexpected error occurred");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="hs-vertically-centered-signup-modal"
      className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
      role="dialog"
      tabIndex={-1}
      aria-labelledby="hs-vertically-centered-signup-modal"
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg md:max-w-3xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3rem)] h-[80vh] max-h-[80vh] flex items-center">
        <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
          <div className="bg-white rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
            <div className="grid md:grid-cols-2">
              <div className="signinBg p-6 rounded-s-xl rounded-tr-xl md:rounded-tr-none rounded-bl-none md:rounded-bl-2xl m-0">
                <h2 className="text-white text-2xl font-bold">
                  Success starts here
                </h2>
                <div className="flex-col space-y-5 mt-6">
                  <p className="flex items-center gap-2 text-white text-lg font-medium">
                    <span>
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white size-3 flex-shrink-0"
                      >
                        <path d="M13.6202 2.6083L5.4001 10.8284L2.37973 7.80805C2.23329 7.66161 1.99585 7.66161 1.84939 7.80805L0.96551 8.69193C0.819073 8.83836 0.819073 9.0758 0.96551 9.22227L5.13492 13.3917C5.28135 13.5381 5.51879 13.5381 5.66526 13.3917L15.0344 4.02252C15.1809 3.87608 15.1809 3.63865 15.0344 3.49218L14.1505 2.6083C14.0041 2.46186 13.7667 2.46186 13.6202 2.6083Z"></path>
                      </svg>
                    </span>{" "}
                    Over 700 categories
                  </p>
                  <p className="flex items-center gap-2 text-white text-lg font-medium">
                    <span>
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="text-white size-3 flex-shrink-0"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.6202 2.6083L5.4001 10.8284L2.37973 7.80805C2.23329 7.66161 1.99585 7.66161 1.84939 7.80805L0.96551 8.69193C0.819073 8.83836 0.819073 9.0758 0.96551 9.22227L5.13492 13.3917C5.28135 13.5381 5.51879 13.5381 5.66526 13.3917L15.0344 4.02252C15.1809 3.87608 15.1809 3.63865 15.0344 3.49218L14.1505 2.6083C14.0041 2.46186 13.7667 2.46186 13.6202 2.6083Z"></path>
                      </svg>
                    </span>{" "}
                    Quality work done faster
                  </p>
                  <p className="flex items-center gap-2 text-white text-lg font-medium">
                    <span>
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="text-white size-3"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg flex-shrink-0 "
                      >
                        <path d="M13.6202 2.6083L5.4001 10.8284L2.37973 7.80805C2.23329 7.66161 1.99585 7.66161 1.84939 7.80805L0.96551 8.69193C0.819073 8.83836 0.819073 9.0758 0.96551 9.22227L5.13492 13.3917C5.28135 13.5381 5.51879 13.5381 5.66526 13.3917L15.0344 4.02252C15.1809 3.87608 15.1809 3.63865 15.0344 3.49218L14.1505 2.6083C14.0041 2.46186 13.7667 2.46186 13.6202 2.6083Z"></path>
                      </svg>
                    </span>
                    Access to talent and businesses across the globe
                  </p>
                </div>
              </div>
              <div className="py-4 px-2 sm:p-5">
                <div className="flex justify-between items-center px-4 dark:border-neutral-700">
                  {showEmailForm && (
                    <button
                      onClick={() => setShowEmailForm(false)}
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      ←
                    </button>
                  )}
                </div>
                <div className="py-4 px-2 sm:p-5">
                  {!showEmailForm ? (
                    <>
                      <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-900 dark:text-white">
                          Sign up to create your account
                        </h1>
                      </div>

                      <div className="mt-5 space-y-12 md:space-y-36">
                        <div className="">
                          <button
                            onClick={handleGoogleSignIn}
                            type="button"
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                          >
                            <svg
                              className="w-4 h-auto"
                              width="46"
                              height="47"
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
                          </button>

                          <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                            Or
                          </div>

                          <button
                            onClick={() => setShowEmailForm(true)}
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                          >
                            Continue with Email/Username
                          </button>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-neutral-400 text-center ">
                          By joining, you agree to the Fiverr Terms of Service
                          and to occasionally receive emails from us. Please
                          read our Privacy Policy.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Continue with your email and password
                      </h2>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-y-4">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm mb-2 dark:text-white"
                            >
                              Name
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                id="name"
                                {...register("name")}
                                className="py-3 px-4 block w-full border border-gray-700 rounded-lg text-sm focus:border-green-500 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                              />
                            </div>
                            {errors.name && (
                              <p className="text-xs text-red-600 mt-2">
                                {errors.name.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm mb-2 dark:text-white"
                            >
                              Email address
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                id="email"
                                {...register("email")}
                                className="py-3 px-4 block w-full border border-gray-700 rounded-lg text-sm focus:border-green-500 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                              />
                            </div>
                            {errors.email && (
                              <p className="text-xs text-red-600 mt-2">
                                {errors.email.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <div className="flex justify-between items-center">
                              <label
                                htmlFor="password"
                                className="block text-sm mb-2 dark:text-white"
                              >
                                Password
                              </label>
                              <Link
                                className="text-sm text-gray-700 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-green-500"
                                href="../examples/html/recover-account.html"
                              >
                                Forgot password?
                              </Link>
                            </div>
                            <div className="relative">
                              <input
                                type="password"
                                id="password"
                                {...register("password")}
                                className="py-3 px-4 block w-full border border-gray-700 rounded-lg text-sm focus:border-green-500 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                              />
                            </div>
                            {errors.password && (
                              <p className="text-xs text-red-600 mt-2">
                                {errors.password.message}
                              </p>
                            )}
                          </div>

                          {error && (
                            <p className="text-xs text-red-600 mt-2">{error}</p>
                          )}

                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                          >
                            {isLoading ? (
                              <>
                                <div
                                  className="animate-spin inline-block size-4 border-[2px] border-current border-t-transparent text-white rounded-full"
                                  role="status"
                                  aria-label="loading"
                                >
                                  <span className="sr-only">Loading...</span>
                                </div>
                                Signing in...
                              </>
                            ) : (
                              "Sign up"
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
