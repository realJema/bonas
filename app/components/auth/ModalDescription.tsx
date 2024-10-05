
const ModalDescription = () => {
  return (
    <div className="signinBg p-6 hidden md:block rounded-s-md">
      <h2 className="text-white text-3xl font-bold">Success starts here</h2>
      <div className="flex-col space-y-6 mt-7">
        {[
          "Over 700 categories",
          "Quality work done faster",
          "Access to talent and businesses across the globe",
        ].map((text, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-white text-lg md:text-xl font-medium"
          >
            <svg
              className="text-white size-3 md:siz-4 flex-shrink-0 mt-2"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M13.62 2.61L5.4 10.83L2.38 7.81C2.23 7.66 1.99 7.66 1.85 7.81L0.97 8.69C0.82 8.84 0.82 9.08 0.97 9.22L5.13 13.39C5.28 13.54 5.52 13.54 5.67 13.39L15.03 4.02C15.18 3.88 15.18 3.64 15.03 3.49L14.15 2.61C14 2.46 13.77 2.46 13.62 2.61Z"
              />
            </svg>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModalDescription