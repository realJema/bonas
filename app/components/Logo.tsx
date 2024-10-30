import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="text-2xl font-black text-black opacity-90 flex items-center"
    >
      <span className="relative">
        Bonas
        <span className="absolute bottom-2 -right-2">
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.29998 8.00001C6.29998 8.00001 7.99998 6.3 7.99998 4.3C7.99998 2.3 6.29998 0.600006 4.29998 0.600006C2.29998 0.600006 0.599976 2.3 0.599976 4.3C0.599976 6.3 2.29998 8.00001 4.29998 8.00001Z"
              fill="#1DBF73"
            />
          </svg>
        </span>
      </span>
    </Link>
  );
};

export default Logo;
