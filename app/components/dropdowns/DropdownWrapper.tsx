import { PropsWithChildren } from "react";

const DropdownWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="absolute left-0 top-full w-full max-w-5xl bg-white shadow-sm overflow-hidden z-30">
      <div className="p-[2px] bg-gray-300">
        <div className="bg-white p-6">{children}</div>
      </div>
    </div>
  );
};

export default DropdownWrapper;
