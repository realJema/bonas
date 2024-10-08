import { useState, useEffect } from 'react';

interface Step1Props {
  onContinue: (data: { title: string; description: string }) => void;
  formData: { title: string; description: string };
}

export default function Step1({ onContinue, formData }: Step1Props) {
  const [title, setTitle] = useState(formData.title || '');
  const [description, setDescription] = useState(formData.description || '');

  useEffect(() => {
    setTitle(formData.title || '');
    setDescription(formData.description || '');
  }, [formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onContinue({ title, description });
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Column */}
      <div className="w-full md:w-1/3 pr-0 md:pr-8 mb-6 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-black">
          Let the matching begin…
        </h1>
        <p className="text-lg mb-2 text-gray-700">
          This is where you fill us in on the big picture.
        </p>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          How does the matching thing work?
        </a>
        <div className="mt-8 hidden md:block">
          {/* SVG drawing of a person */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-32 md:w-48 h-32 md:h-48"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25h-1.5v-1.5h-1.5v1.5h-1.5v1.5h1.5v-1.5h1.5v-1.5z" />
          </svg>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full md:w-2/3">
        <form onSubmit={handleSubmit} className="flex flex-col h-auto md:h-[700px]">
          <div className="flex-grow space-y-8">
            <div>
              <label htmlFor="title" className="block font-bold mb-2 text-black text-lg">
                Give your project brief a title
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Keep it short and simple – this will help us match you to the right category.
              </p>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  className="w-full border rounded-md p-2 pr-16 text-black bg-gray-200"
                  placeholder="Example: Create a WordPress website for my company"
                  maxLength={70}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="absolute right-2 top-2 text-sm text-gray-400">{title.length}/70</span>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block font-bold mb-2 text-black text-lg">
                What are you looking to get done?
              </label>
              <p className="text-sm text-gray-600 mb-2">
                This will help get your brief to the right talent. Specifics help here.
              </p>
              <div className="relative">
                <textarea
                  id="description"
                  className="w-full border rounded-md p-2 h-64 text-black bg-gray-200"
                  placeholder="I need…"
                  maxLength={5000}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <span className="absolute right-2 bottom-2 text-sm text-gray-400">{description.length}/2000</span>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-auto text-right">
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded text-lg font-semibold w-full md:w-auto"
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
