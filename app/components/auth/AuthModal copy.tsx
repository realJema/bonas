import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";

// Schemas
const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
});

const signUpSchema = signInSchema.extend({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;
type FormData = SignInFormData | SignUpFormData;

interface AuthModalProps {
  isSignIn: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isSignIn, onClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignInForm, setIsSignInForm] = useState(isSignIn);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(isSignInForm ? signInSchema : signUpSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");

    if (isSignInForm) {
      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Invalid email or password");
        } else {
          toast.success("You have been successfully logged in");
          router.push("/");
          onClose();
        }
      } catch (error) {
        setError("An unexpected error occurred");
      }
    } else {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          toast.success("Account created successfully!");
          setIsSignInForm(true);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "An unexpected error occurred");
        }
      } catch (error) {
        setError("An unexpected error occurred");
      }
    }

    setIsLoading(false);
  };

  return (
    <div
      id="hs-vertically-centered-modal"
      className="hs-overlay size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
      role="dialog"
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-2xl md:max-w-4xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
          <div className="bg-white rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
            <div className="grid md:grid-cols-2">
              {/* Left side with background image - remains the same */}
              <div className="signinBg p-6 rounded-s-xl rounded-tr-xl md:rounded-tr-none rounded-bl-none md:rounded-bl-2xl m-0">
                <h2 className="text-white text-2xl font-bold">
                  Success starts here
                </h2>
                <div className="flex-col gap-6 mt-5">
                  <p className="flex items-center gap-2 text-white text-lg font-medium">
                    <span>
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white size-3"
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
                        className="text-white size-3"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.6202 2.6083L5.4001 10.8284L2.37973 7.80805C2.23329 7.66161 1.99585 7.66161 1.84939 7.80805L0.96551 8.69193C0.819073 8.83836 0.819073 9.0758 0.96551 9.22227L5.13492 13.3917C5.28135 13.5381 5.51879 13.5381 5.66526 13.3917L15.0344 4.02252C15.1809 3.87608 15.1809 3.63865 15.0344 3.49218L14.1505 2.6083C14.0041 2.46186 13.7667 2.46186 13.6202 2.6083Z"></path>
                      </svg>
                    </span>{" "}
                    Quality work done faster
                  </p>
                  <p className="flex items-start gap-2 text-white text-lg font-medium">
                    <span>
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="text-white size-3"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.6202 2.6083L5.4001 10.8284L2.37973 7.80805C2.23329 7.66161 1.99585 7.66161 1.84939 7.80805L0.96551 8.69193C0.819073 8.83836 0.819073 9.0758 0.96551 9.22227L5.13492 13.3917C5.28135 13.5381 5.51879 13.5381 5.66526 13.3917L15.0344 4.02252C15.1809 3.87608 15.1809 3.63865 15.0344 3.49218L14.1505 2.6083C14.0041 2.46186 13.7667 2.46186 13.6202 2.6083Z"></path>
                      </svg>
                    </span>
                    Access to talent and businesses across the globe
                  </p>
                </div>
              </div>

              {/* Right side - changes based on sign-in or sign-up */}
              <div className="p-4 sm:p-7">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                    {isSignInForm ? "Sign in" : "Sign up"}
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                    {isSignInForm
                      ? "Don't have an account yet?"
                      : "Already have an account?"}
                    <button
                      onClick={() => setIsSignInForm(!isSignInForm)}
                      className="text-gray-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-green-500 ml-1"
                    >
                      {isSignInForm ? "Join here" : "Sign in"}
                    </button>
                  </p>
                </div>

                <div className="mt-5">
                  {/* Google Sign-in button */}
                  <Link
                    href="/api/auth/signin"
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
                    Sign in with Google
                  </Link>

                  <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                    Or
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    {!isSignInForm && (
                      <div className="mb-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          {...register("name")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        {!isSignInForm && "name" in errors && errors.name && (
                          <p className="text-xs text-red-600 mt-2">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register("email")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        {...register("password")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      {isLoading
                        ? "Processing..."
                        : isSignInForm
                        ? "Sign In"
                        : "Sign Up"}
                    </button>
                  </form>
                  <p className="mt-4 text-sm text-center">
                    {isSignInForm
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <button
                      onClick={() => setIsSignInForm(!isSignInForm)}
                      className="text-blue-500 hover:underline focus:outline-none"
                    >
                      {isSignInForm ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
