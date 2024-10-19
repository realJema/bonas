import Link from 'next/link';
import React from 'react';

interface Props {
  description: string;
  languages: { language: string; level: string }[];
  skills: string[];
  education?: string;
  certification?: string;
}

const DescriptionCard = ({
  description,
  languages,
  skills,
  education,
  certification
}: Props) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-600">{description}</p>
        <button className="text-blue-500 mt-2">Edit Description</button>
      </div>

      <hr className="border-gray-200 mb-4" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Languages</h3>
          <button className="text-blue-500 hover:underline">Add New</button>
        </div>
        <ul>
          {languages.map((lang, index) => (
            <li key={index} className="text-gray-600">
              {lang.language} - {lang.level}
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-gray-200 mb-4" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Skills</h3>
          <button className="text-blue-500 hover:underline">Add New</button>
        </div>
        <ul>
          {skills.map((skill, index) => (
            <li key={index} className="text-gray-600">
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-gray-200 mb-4" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Education</h3>
          <button className="text-blue-500 hover:underline">Add New</button>
        </div>
        <p className="text-gray-400 italic">
          {education || "Add your Education"}
        </p>
      </div>

      <hr className="border-gray-200 mb-4" />

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Certification</h3>
          <button className="text-blue-500 hover:underline">Add New</button>
        </div>
        <p className="text-gray-400 italic">
          {certification || "Add your Certification"}
        </p>
      </div>
    </div>
  );
};

export default DescriptionCard;