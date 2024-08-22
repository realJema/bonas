"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" }),
});

type FormData = z.infer<typeof loginSchema>;

const SignInModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: FormData) => {
    // Handle form submission
    console.log(data);
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div
      id="hs-signin-modal"
      className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto"
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-xl md:max-w-3xl sm:w-full m-3 sm:mx-auto h-[80vh] min-h-[80vh] max-h-[80vh] overflow-y-auto flex items-stretch">
        <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
          <div className="flex justify-between items-center px-4 dark:border-neutral-700"></div>
          <div className="bg-white rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700 flex-grow">
            <div className="grid md:grid-cols-2 h-full">
              <div className="signinBg p-6 rounded-s-xl rounded-tr-xl md:rounded-tr-none rounded-bl-none md:rounded-bl-2xl m-0">
                <h2 className="text-white text-2xl font-bold">
                  Success starts here
                </h2>
                {/* <button
                  type="button"
                  className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                  data-hs-overlay="#hs-signup-modal"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-3.5 h-3.5"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                      fill="currentColor"
                    />
                  </svg>
                </button> */}
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
              <div className="p-4 sm:p-7">
                {showEmailForm && (
                  <button
                    onClick={() => setShowEmailForm(false)}
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    ←
                  </button>
                )}
                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                    Sign In
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                    Don&apos;t have an account yet?{" "}
                    <Link
                      className="text-gray-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-green-500"
                      href="../examples/html/signup.html"
                    >
                      Join here
                    </Link>
                  </p>
                </div>

                <div className="py-4 px-2 sm:p-5 mt-5">
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
                              "Sign in"
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

export default SignInModal;

// // "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { signIn } from "next-auth/react";
// import { toast } from "react-toastify";
// import { EnvelopeIcon } from "@heroicons/react/24/outline";

// const schema = z.object({
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z
//     .string()
//     .min(5, { message: "Password must be at least 5 characters long" }),
//   name: z
//     .string()
//     .min(3, { message: "Name must be at least 3 characters long" }),
// });

// type FormData = z.infer<typeof schema>;

// const SignInModal = () => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   // useEffect(() => {
//   //   if (typeof window !== "undefined") {
//   //     window.initPreline();
//   //     const modal = document.getElementById("hs-vertically-centered-modal");
//   //     if (modal) {
//   //       window.HSCore.components.HSModal.init(modal);
//   //     }
//   //   }
//   // }, []);

//   const handleGoogleSignIn = () => {
//     signIn("google", { callbackUrl: "/" });
//   };

//   return (
//     <div
//       id="hs-vertically-centered-modal"
//       className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
//       role="dialog"
//       tabIndex={-1}
//       aria-labelledby="hs-vertically-centered-modal-label"
//     >
//       <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-xl md:max-w-3xl sm:w-full m-3 sm:mx-auto h-[80vh] min-h-[80vh] max-h-[80vh] overflow-y-auto flex items-stretch">
//         <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
//           <div className="flex justify-between items-center px-4 dark:border-neutral-700"></div>
//           <div className="bg-white rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700 flex-grow">
//             <div className="grid md:grid-cols-2 h-full">
//               <div className="signinBg p-6 rounded-s-xl rounded-tr-xl md:rounded-tr-none rounded-bl-none md:rounded-bl-2xl m-0">
//                 <h2 className="text-white text-2xl font-bold">
//                   Success starts here
//                 </h2>
//                 <div className="flex-col space-y-5 mt-6">
//                   <p className="flex items-center gap-2 text-white text-lg font-medium">
//                     <span>
//                       <svg
//                         width="16"
//                         height="16"
//                         fill="currentColor"
//                         viewBox="0 0 16 16"
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="text-white size-3 flex-shrink-0"
//                       >
//                         <path d="M13.6202 2.6083L5.4001 10.8284L2.37973 7.80805C2.23329 7.66161 1.99585 7.66161 1.84939 7.80805L0.96551 8.69193C0.819073 8.83836 0.819073 9.0758 0.96551 9.22227L5.13492 13.3917C5.28135 13.5381 5.51879 13.5381 5.66526 13.3917L15.0344 4.02252C15.1809 3.87608 15.1809 3.63865 15.0344 3.49218L14.1505 2.6083C14.0041 2.46186 13.7667 2.46186 13.6202 2.6083Z"></path>
//                       </svg>
//                     </span>{" "}
//                     Over 700 categories
//                   </p>
//                   <p className="flex items-center gap-2 text-white text-lg font-medium">
//                     <span>
//                       <svg
//                         width="16"
//                         height="16"
//                         fill="currentColor"
//                         className="text-white size-3 flex-shrink-0"
//                         viewBox="0 0 16 16"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path d="M13.6202 2.6083L5.4001 10.8284L2.37973 7.80805C2.23329 7.66161 1.99585 7.66161 1.84939 7.80805L0.96551 8.69193C0.819073 8.83836 0.819073 9.0758 0.96551 9.22227L5.13492 13.3917C5.28135 13.5381 5.51879 13.5381 5.66526 13.3917L15.0344 4.02252C15.1809 3.87608 15.1809 3.63865 15.0344 3.49218L14.1505 2.6083C14.0041 2.46186 13.7667 2.46186 13.6202 2.6083Z"></path>
//                       </svg>
//                     </span>{" "}
//                     Quality work done faster
//                   </p>
//                   <p className="flex items-center gap-2 text-white text-lg font-medium">
//                     <span>
//                       <svg
//                         width="16"
//                         height="16"
//                         fill="currentColor"
//                         className="text-white size-3"
//                         viewBox="0 0 16 16"
//                         xmlns="http://www.w3.org/2000/svg flex-shrink-0 "
//                       >
//                         <path d="M13.6202 2.6083L5.4001 10.8284L2.37973 7.80805C2.23329 7.66161 1.99585 7.66161 1.84939 7.80805L0.96551 8.69193C0.819073 8.83836 0.819073 9.0758 0.96551 9.22227L5.13492 13.3917C5.28135 13.5381 5.51879 13.5381 5.66526 13.3917L15.0344 4.02252C15.1809 3.87608 15.1809 3.63865 15.0344 3.49218L14.1505 2.6083C14.0041 2.46186 13.7667 2.46186 13.6202 2.6083Z"></path>
//                       </svg>
//                     </span>
//                     Access to talent and businesses across the globe
//                   </p>
//                 </div>
//               </div>
//               <div className="p-4 sm:p-7">
//                 <div className="text-center">
//                   <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
//                     Sign In
//                   </h1>
//                   <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
//                     Don&apos;t have an account yet?{" "}
//                     <Link
//                       className="text-gray-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-green-500"
//                       href="../examples/html/signup.html"
//                     >
//                       Join here
//                     </Link>
//                   </p>
//                 </div>

//                 <div className="mt-5">
//                   <button
//                     onClick={handleGoogleSignIn}
//                     type="button"
//                     className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
//                   >
//                     <svg
//                       className="w-4 h-auto"
//                       width="46"
//                       height="47"
//                       viewBox="0 0 46 47"
//                       fill="none"
//                     >
//                       <path
//                         d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
//                         fill="#4285F4"
//                       />
//                       <path
//                         d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
//                         fill="#34A853"
//                       />
//                       <path
//                         d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
//                         fill="#FBBC05"
//                       />
//                       <path
//                         d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
//                         fill="#EB4335"
//                       />
//                     </svg>
//                     Sign in with Google
//                   </button>

//                   <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
//                     Or
//                   </div>

//                   {/* <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className="grid gap-y-4">
//                       <div>
//                         <label
//                           htmlFor="email"
//                           className="block text-sm mb-2 dark:text-white"
//                         >
//                           Email address
//                         </label>
//                         <div className="relative">
//                           <input
//                             type="email"
//                             id="email"
//                             {...register("email")}
//                             className="py-3 px-4 block w-full border border-gray-700 rounded-lg text-sm focus:border-green-500 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
//                           />
//                         </div>
//                         {errors.email && (
//                           <p className="text-xs text-red-600 mt-2">
//                             {errors.email.message}
//                           </p>
//                         )}
//                       </div>

//                       <div>
//                         <div className="flex justify-between items-center">
//                           <label
//                             htmlFor="password"
//                             className="block text-sm mb-2 dark:text-white"
//                           >
//                             Password
//                           </label>
//                           <Link
//                             className="text-sm text-green-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-green-500"
//                             href="../examples/html/recover-account.html"
//                           >
//                             Forgot password?
//                           </Link>
//                         </div>
//                         <div className="relative">
//                           <input
//                             type="password"
//                             id="password"
//                             {...register("password")}
//                             className="py-3 px-4 block w-full border border-gray-700 rounded-lg text-sm focus:border-green-500 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
//                           />
//                         </div>
//                         {errors.password && (
//                           <p className="text-xs text-red-600 mt-2">
//                             {errors.password.message}
//                           </p>
//                         )}
//                       </div>

//                       {error && (
//                         <p className="text-xs text-red-600 mt-2">{error}</p>
//                       )}

//                       <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
//                       >
//                         {isLoading ? (
//                           <>
//                             <div
//                               className="animate-spin inline-block size-4 border-[2px] border-current border-t-transparent text-white rounded-full"
//                               role="status"
//                               aria-label="loading"
//                             >
//                               <span className="sr-only">Loading...</span>
//                             </div>
//                             Signing in...
//                           </>
//                         ) : (
//                           "Sign in"
//                         )}
//                       </button>
//                     </div>
//                   </form> */}
//                   <Link
//                     href="/api/auth/signin"
//                     type="button"
//                     className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
//                   >
//                     <EnvelopeIcon className="h-5 w-5" />
//                     Sign in with Email/password
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignInModal;
