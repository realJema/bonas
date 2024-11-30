import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MailIcon } from "lucide-react";
import verificationImage from "@/public/verification-image.png";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const VerificationModal = ({
  isOpen,
  onClose,
  email,
}: VerificationModalProps) => {
  const getEmailLink = (email: string) => {
    const domain = email.split("@")[1];
    if (domain === "gmail.com") {
      return `https://mail.google.com/mail/u/?authuser=${encodeURIComponent(
        email
      )}`;
    } else {
      return `mailto:${email}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] md:h-[650px] md:max-w-4xl xl:h-[700px] xl:max-w-5xl p-0 border-none">
        <div className="grid md:grid-cols-2 h-full">
          <div className="relative h-[200px] md:h-full rounded-s-md overflow-hidden">
            <Image
              src={verificationImage}
              alt="Email Verification"
              layout="fill"
              objectFit="cover rounded-s-md"
            />
          </div>
          <div className="p-6 space-y-6">
            <div className="text-center">
              <MailIcon className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Check your email
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center">
                We&apos;ve sent a verification link to:
              </p>
              <div className="flex items-center justify-center space-x-2 bg-zinc-100 p-3 rounded-md">
                <MailIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">
                  {email}
                </span>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Click the link below to check your inbox or check manually.
              </p>
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  const link = getEmailLink(email);
                  if (link.startsWith("mailto:")) {
                    window.location.href = link;
                  } else {
                    window.open(link, "_blank");
                  }
                }}
              >
                Go to your inbox
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
