import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ModalDescription from "./ModalDescription";
import { RegisterSchema } from "@/schemas";
import { register as signUp } from "@/actions/register";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import VerificationModal from "@/app/auth/new-verification/VerificationModal";
import Image from "next/image";
import PasswordValidationRules from "./PasswordValidationRule";

type FormData = z.infer<typeof RegisterSchema>;

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  switchToSignin: () => void;
}

const SignupModal = ({ isOpen, onClose, switchToSignin }: SignupModalProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [currentPhase, setCurrentPhase] = useState<
    "initial" | "email" | "username"
  >("initial");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    getValues,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setError("");
    setIsLoading(true);

    try {
      const result = await signUp(data);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        toast.success(result.success);
        reset();
        setRegisteredEmail(data.email);
        setShowVerificationModal(true);
        onClose();

        // Store the password in the local storage
        localStorage.setItem("password", data.password);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  const renderInitialPhase = () => (
    <div>
      <div className="text-center mb-6">
        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
          Create a new account
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
          Already have an account?
          <button
            className="text-gray-700 decoration-2 hover:underline font-medium"
            onClick={() => {
              onClose();
              switchToSignin();
            }}
          >
            Signin here
          </button>
        </p>
      </div>
      <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
        <svg className="w-4 h-auto mr-2" viewBox="0 0 46 47" fill="none">
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
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <Button
        onClick={() => setCurrentPhase("email")}
        variant="outline"
        className="w-full"
      >
        Continue with Email/Username
      </Button>
    </div>
  );

  const renderEmailPhase = () => (
    <div>
      <button
        onClick={() => setCurrentPhase("initial")}
        className="text-xl font-bold text-gray-900 dark:text-white mb-4"
      >
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Continue with your email and password
      </h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link className="text-sm text-green-600 hover:underline" href="#">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className="mb-3"
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>
        <PasswordValidationRules password={password || ""} className="my-3" />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button
          size="xl"
          className="bg-black w-full"
          onClick={() => {
            if (
              getValues("name") &&
              getValues("email") &&
              getValues("password") &&
              !errors.name &&
              !errors.email &&
              !errors.password
            ) {
              setCurrentPhase("username");
            }
          }}
          disabled={
            !getValues("name") ||
            !getValues("email") ||
            !getValues("password") ||
            !!errors.name ||
            !!errors.email ||
            !!errors.password
          }
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderUsernamePhase = () => (
    <div>
      <button
        onClick={() => setCurrentPhase("email")}
        className="text-xl font-bold text-gray-900 dark:text-white mb-4"
      >
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Get your profile started
      </h2>
      <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
        Add a username that&apos;s unique to you, this is how you&apos;ll appear
        to others.
      </p>
      <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
        You can&apos;t change your username, so choose wisely.
      </p>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Choose a username</Label>
          <Input id="username" {...register("username")} />
          {errors.username && (
            <p className="text-xs text-red-600">{errors.username.message}</p>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-neutral-400">
          Build trust by using your full name or business name
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button
          size="xl"
          type="submit"
          className="w-full bg-black"
          disabled={isLoading || !isValid}
          onClick={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <div>
              <div className="animate-spin inline-block size-4 border-[2px] border-current border-t-transparent text-white rounded-full mr-2" />
              Creating your account...
            </div>
          ) : (
            "Create my account"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] h-[600px] md:h-[650px] md:max-w-4xl xl:h-[700px] xl:max-w-5xl p-0 border-none">
          <div className="grid md:grid-cols-2">
            {currentPhase === "username" ? (
              <div className="relative h-[200px] md:h-full">
                <Image
                  src="/username-image.png"
                  alt="Username selection"
                  fill
                  className="object-cover rounded-s-md"
                />
              </div>
            ) : (
              <ModalDescription />
            )}
            <div className="p-5 sm:p-7 flex flex-col justify-between h-full">
              <div className="">
                {currentPhase === "initial" && renderInitialPhase()}
                {currentPhase === "email" && renderEmailPhase()}
                {currentPhase === "username" && renderUsernamePhase()}
              </div>
              <p className="text-xs text-gray-600 dark:text-neutral-400 text-center mt-4">
                By joining, you agree to the Fiverr Terms of Service and to
                occasionally receive emails from us. Please read our Privacy
                Policy.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={registeredEmail}
      />
    </div>
  );
};

export default SignupModal;

// const SignupModal = ({ isOpen, onClose, switchToSignin }: SignupModalProps) => {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [showEmailPhase, setShowEmailPhase] = useState(false);
//   const [showUsernamePahse, setShowUsernamePahse] = useState(false);
//   const [showVerificationModal, setShowVerificationModal] = useState(false);
//   const [registeredEmail, setRegisteredEmail] = useState("");

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isValid },
//   } = useForm<FormData>({
//     resolver: zodResolver(RegisterSchema),
//   });

//   const onSubmit = async (data: FormData) => {
//     setError("");
//     setIsLoading(true);

//     try {
//       const result = await signUp(data);
//       if (result.error) {
//         setError(result.error);
//       } else if (result.success) {
//         toast.success(result.success);
//         reset();
//         setRegisteredEmail(data.email);
//         setShowVerificationModal(true);
//         onClose();

//         // Store the password in the local storage
//         localStorage.setItem("password", data.password);
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error("An unexpected error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSignIn = () => {
//     signIn("google", {
//       callbackUrl: DEFAULT_LOGIN_REDIRECT,
//     });
//   };

//   const toggleEmailPhase = () => {
//     setShowEmailPhase(!showEmailPhase);
//   };

//   const toggleUsernamePhase = () => {
//     setShowUsernamePahse(!showUsernamePahse);
//   };

//   return (
//     <div>
//       <Dialog open={isOpen} onOpenChange={onClose}>
//         <DialogContent className="sm:max-w-[500px] h-[600px] md:max-w-4xl p-0">
//           <div className="grid md:grid-cols-2">
//             <ModalDescription />
//             <div className="p-5 sm:p-7 flex flex-col justify-between h-full">
//               <div className="">
//                 {showEmailPhase && (
//                   <button
//                     onClick={toggleEmailPhase}
//                     className="text-xl font-bold text-gray-900 dark:text-white mb-4"
//                   >
//                     ← Back
//                   </button>
//                 )}
//                 {!showEmailPhase && (
//                   <div className="text-center mb-6">
//                     <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
//                       Create a new account
//                     </h1>
//                     <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
//                       Already have an account?
//                       <button
//                         className="text-gray-700 decoration-2 hover:underline font-medium"
//                         onClick={() => {
//                           onClose();
//                           switchToSignin();
//                         }}
//                       >
//                         Signin here
//                       </button>
//                     </p>
//                   </div>
//                 )}

//                 {!showEmailPhase ? (
//                   <div>
//                     <Button
//                       onClick={handleGoogleSignIn}
//                       variant="outline"
//                       className="w-full"
//                     >
//                       <svg
//                         className="w-4 h-auto mr-2"
//                         viewBox="0 0 46 47"
//                         fill="none"
//                       >
//                         <path
//                           d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
//                           fill="#4285F4"
//                         />
//                         <path
//                           d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
//                           fill="#34A853"
//                         />
//                         <path
//                           d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
//                           fill="#FBBC05"
//                         />
//                         <path
//                           d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
//                           fill="#EB4335"
//                         />
//                       </svg>
//                       Continue with Google
//                     </Button>
//                     <div className="relative my-4">
//                       <div className="absolute inset-0 flex items-center">
//                         <span className="w-full border-t" />
//                       </div>
//                       <div className="relative flex justify-center text-xs uppercase">
//                         <span className="bg-background px-2 text-muted-foreground">
//                           Or
//                         </span>
//                       </div>
//                     </div>
//                     <Button
//                       onClick={toggleEmailPhase}
//                       variant="outline"
//                       className="w-full"
//                     >
//                       Continue with Email/Username
//                     </Button>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleSubmit(onSubmit)}>
//                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//                       Continue with your email and password
//                     </h2>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="name">Name</Label>
//                         <Input id="name" {...register("name")} />
//                         {errors.name && (
//                           <p className="text-xs text-red-600">
//                             {errors.name.message}
//                           </p>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="email">Email address</Label>
//                         <Input id="email" type="email" {...register("email")} />
//                         {errors.email && (
//                           <p className="text-xs text-red-600">
//                             {errors.email.message}
//                           </p>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor="password">Password</Label>
//                           <Link
//                             className="text-sm text-green-600 hover:underline"
//                             href="#"
//                           >
//                             Forgot password?
//                           </Link>
//                         </div>
//                         <Input
//                           id="password"
//                           type="password"
//                           {...register("password")}
//                         />
//                         {errors.password && (
//                           <p className="text-xs text-red-600">
//                             {errors.password.message}
//                           </p>
//                         )}
//                       </div>
//                       {error && <p className="text-xs text-red-600">{error}</p>}
//                       <Button className="bg-black w-full" onClick={}>Continue</Button>

//                       {/* username phase */}
//                       <div>
//                         <button
//                           onClick={() => {}}
//                           className="text-xl font-bold text-gray-900 dark:text-white mb-4"
//                         >
//                           ← Back
//                         </button>
//                         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//                           Get your profile started
//                         </h2>
//                         <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
//                           Add a username that&apos;s unique to you, this is how
//                           you&apos;ll appear to others.
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
//                           You can&apos;t change your username, so choose wisely.
//                         </p>
//                         <div className="space-y-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="username">Choose a username</Label>
//                             <Input id="username" {...register("username")} />
//                             {errors.username && (
//                               <p className="text-xs text-red-600">
//                                 {errors.username.message}
//                               </p>
//                             )}
//                           </div>
//                           <p className="text-xs text-gray-600 dark:text-neutral-400">
//                             Build trust by using your full name or business name
//                           </p>
//                           {error && (
//                             <p className="text-xs text-red-600">{error}</p>
//                           )}
//                           <Button
//                             type="submit"
//                             className="w-full bg-black"
//                             disabled={isLoading || !isValid}
//                           >
//                             {isLoading ? (
//                               <div>
//                                 <div className="animate-spin inline-block size-4 border-[2px] border-current border-t-transparent text-white rounded-full mr-2" />
//                                 Signing up...
//                               </div>
//                             ) : (
//                               "Sign up"
//                             )}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </form>
//                 )}
//               </div>
//               <p className="text-xs text-gray-600 dark:text-neutral-400 text-center mt-4">
//                 By joining, you agree to the Fiverr Terms of Service and to
//                 occasionally receive emails from us. Please read our Privacy
//                 Policy.
//               </p>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//       <VerificationModal
//         isOpen={showVerificationModal}
//         onClose={() => setShowVerificationModal(false)}
//         email={registeredEmail}
//       />
//     </div>
//   );
// };

// export default SignupModal;
