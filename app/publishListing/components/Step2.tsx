import { useState, useEffect } from 'react';

interface Step2Props {
  onContinue: (data: { category: string; address: string; town: string; tags: string[] }) => void;
  onBack: () => void;
  formData: {
    category?: string;
    address?: string;
    town?: string;
    tags?: string[];
  };
}

export default function Step2({ onContinue, onBack, formData }: Step2Props) {
  const [category, setCategory] = useState<string>(formData.category || '');
  const [address, setAddress] = useState<string>(formData.address || '');
  const [town, setTown] = useState<string>(formData.town || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(formData.tags || []);

  useEffect(() => {
    setCategory(formData.category || '');
    setAddress(formData.address || '');
    setTown(formData.town || '');
    setSelectedTags(formData.tags || []);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onContinue({ category, address, town, tags: selectedTags });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const categoryTags = {
    'Web Development': ['Frontend', 'Backend', 'Full Stack', 'WordPress', 'E-commerce', 'React', 'Node.js', 'Angular', 'Vue.js', 'PHP', 'Python', 'Java', 'Ruby on Rails', 'ASP.NET', 'Database Design', 'API Development', 'Mobile Web'],
    'Graphic Design': ['Logo Design', 'Branding', 'Illustration', 'UI/UX', 'Print Design', 'Packaging', 'Web Design', 'Icon Design', 'Infographics', 'Social Media Graphics', 'Album Cover Art', 'T-shirt Design', 'Banner Ads', 'Photo Editing', '3D Modeling'],
    'Writing': ['Content Writing', 'Copywriting', 'Technical Writing', 'Creative Writing', 'Editing', 'Proofreading', 'Blog Posts', 'Article Writing', 'SEO Writing', 'Scriptwriting', 'Grant Writing', 'Resume Writing', 'Product Descriptions', 'Academic Writing', 'Ghostwriting'],
    'Digital Marketing': ['SEO', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'PPC Advertising', 'Influencer Marketing', 'Analytics', 'Marketing Strategy', 'Brand Management', 'Affiliate Marketing', 'Video Marketing', 'Mobile Marketing'],
    'Video & Animation': ['Video Editing', 'Motion Graphics', '2D Animation', '3D Animation', 'Whiteboard Videos', 'Video Production', 'Visual Effects', 'Animated GIFs', 'Subtitles & Captions', 'Intro & Outro Videos', 'Character Animation'],
    'Music & Audio': ['Voice Over', 'Mixing & Mastering', 'Music Composition', 'Sound Design', 'Podcast Editing', 'Jingles & Intros', 'Audio Editing', 'Singer-Songwriters', 'Sound Effects', 'Audio Branding'],
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Column */}
      <div className="w-full md:w-1/3 pr-0 md:pr-8 mb-6 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-black">
          Categories & Location
        </h1>
        <p className="text-lg mb-2 text-gray-700">
          Help us narrow down your search.
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
        <form onSubmit={handleSubmit} className="flex flex-col h-auto md:h-[600px]">
          <div className="flex-grow space-y-8">
            <div>
              <label htmlFor="category" className="block font-bold mb-2 text-black text-lg">
                Select a category
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Choose the category that best fits your project.
              </p>
              <select 
                id="category" 
                className="w-full border rounded-md p-2 text-black bg-gray-200"
                required
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSelectedTags([]);
                }}
              >
                <option value="">Select a category</option>
                <option value="Web Development">Web Development</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Writing">Writing</option>
                {/* Add more options as needed */}
              </select>
            </div>

            {category && (
              <div>
                <label className="block font-bold mb-2 text-black text-lg">Tags</label>
                <p className="text-sm text-gray-600 mb-2">
                  Select tags that are relevant to your project.
                </p>
                <div className="flex flex-wrap gap-2">
                  {categoryTags[category].map((tag: string) => (
                    <button
                      key={tag}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-black'
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-grow mb-4 md:mb-0">
                <label htmlFor="address" className="block font-bold mb-2 text-black text-lg">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full border rounded-md p-2 text-black bg-gray-200"
                  placeholder="Enter your address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/3">
                <label htmlFor="town" className="block font-bold mb-2 text-black text-lg">
                  Town
                </label>
                <select 
                  id="town" 
                  className="w-full border rounded-md p-2 text-black bg-gray-200"
                  required
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                >
                  <option value="">Select a town</option>
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                  {/* Add more cities as needed */}
                </select>
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
              type="submit"
              className="bg-black text-white px-8 py-3 rounded text-lg font-semibold"
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
