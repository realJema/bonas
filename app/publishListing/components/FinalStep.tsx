import { useState } from 'react';

interface FormData {
  title: string;
  category: string;
  address: string;
  town: string;
  tags: string[];
  description: string;
  budget: string;
  timeline: string;
}

interface FinalStepProps {
  formData: FormData;
  onBack: () => void;
  onPublish: () => void;
}

export default function FinalStep({ formData, onBack, onPublish }: FinalStepProps) {
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate an API call or processing time
    setTimeout(() => {
      onPublish();
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Column */}
      <div className="w-full md:w-1/3 pr-0 md:pr-8 mb-6 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-black">
          Review & Publish
        </h1>
        <p className="text-lg mb-2 text-gray-700">
          Here&apos;s a summary of your project. Review and publish when you&apos;re ready.
        </p>
      </div>

      {/* Right Column (Summary) */}
      <div className="w-full md:w-2/3">
        <div className="flex flex-col h-auto md:h-[600px]">
          <div className="flex-grow overflow-y-auto space-y-8">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-black">Brief Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-black">Title:</h3>
                  <p className="text-black">{formData.title}</p>
                </div>
                <div>
                  <h3 className="font-bold text-black">Category:</h3>
                  <p className="text-black">{formData.category}</p>
                </div>
                <div>
                  <h3 className="font-bold text-black">Address:</h3>
                  <p className="text-black">{formData.address}</p>
                </div>
                <div>
                  <h3 className="font-bold text-black">Town:</h3>
                  <p className="text-black">{formData.town}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-bold text-black">Tags:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.tags && formData.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <h3 className="font-bold text-black">Description:</h3>
                  <p className="text-black">{formData.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-black">Budget & Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-black">Budget:</h3>
                  <p className="text-black">${parseFloat(formData.budget).toFixed(2)} USD</p>
                </div>
                <div>
                  <h3 className="font-bold text-black">Deliver by:</h3>
                  <p className="text-black">{formData.timeline}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-auto flex flex-col md:flex-row justify-between">
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-300 text-black px-8 py-3 rounded text-lg font-semibold mb-4 md:mb-0"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-black text-white px-8 py-3 rounded text-lg font-semibold"
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
