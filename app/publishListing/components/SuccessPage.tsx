import { useState } from 'react';

interface SuccessPageProps {
  onReview: () => void;
}

export default function SuccessPage({ onReview }: SuccessPageProps) {
  const [isReviewing, setIsReviewing] = useState<boolean>(false);

  const handleReview = () => {
    setIsReviewing(true);
    onReview();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <svg className="mx-auto h-24 w-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-black">Listing Successfully Published!</h1>
        <p className="text-xl mb-8 text-gray-600">Your project is now live and visible to potential freelancers.</p>
        <button
          onClick={handleReview}
          disabled={isReviewing}
          className="bg-blue-600 text-white px-8 py-3 rounded text-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          {isReviewing ? 'Returning to Edit...' : 'Review and Edit'}
        </button>
      </div>
    </div>
  );
}
