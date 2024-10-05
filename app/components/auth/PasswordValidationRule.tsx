import { Check } from "lucide-react";

interface PasswordValidationRuleProps {
  isValid: boolean;
  rule: string;
}

const PasswordValidationRule = ({
  isValid,
  rule,
}: PasswordValidationRuleProps) => {
  const baseClasses = "flex items-center space-x-2 text-sm";
  const colorClasses = isValid ? "text-green-500" : "text-gray-400";

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <div
        className={`rounded-full border ${
          isValid ? "border-green-500" : "border-gray-400"
        } p-0.5`}
      >
        <Check size={12} />
      </div>
      <span className={isValid ? "line-through decoration-green-500" : ""}>
        {rule}
      </span>
    </div>
  );
};

interface Props {
  password: string;
  className?: string;
}

const PasswordValidationRules = ({ password, className }: Props) => {
  const rules = [
    { test: (pwd: string) => pwd.length >= 8, text: "At least 8 characters" },
    {
      test: (pwd: string) => /[A-Z]/.test(pwd),
      text: "At least 1 uppercase letter",
    },
    {
      test: (pwd: string) => /[a-z]/.test(pwd),
      text: "At least 1 lowercase letter",
    },
    { test: (pwd: string) => /\d/.test(pwd), text: "At least 1 number" },
  ];

  return (
    <div className={`${className}`}>
      <div className="space-y-2">
        {rules.map((rule, index) => (
          <PasswordValidationRule
            key={index}
            isValid={rule.test(password)}
            rule={rule.text}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordValidationRules;
