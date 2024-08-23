import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface Props {
  message?: string;
}

const FormError = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-2.5 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
