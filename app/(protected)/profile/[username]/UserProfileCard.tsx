

import React from 'react';
import Image from 'next/image';
import { MapPin, User, Pencil } from 'lucide-react';

interface Props {
  name: string;
  username: string;
  location: string;
  memberSince: string;
  isNew?: boolean;
  isOnline?: boolean;
  imageUrl?: string | null;
}

const ProfileCard = ({
  name,
  username,
  location,
  memberSince,
  isNew = false,
  isOnline = false,
  imageUrl
}: Props) => {
  return (
    <div className="bg-white px-6 py-8 rounded-lg shadow-sm relative">
      {isOnline && (
        <span className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
          Online
        </span>
      )}
      <div className="flex justify-center mb-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={100}
            height={100}
            className="rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-gray-600">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold inline-flex items-center">
          {name}
          {isNew && <span className="ml-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs">NEW</span>}
          <Pencil className="w-4 h-4 ml-2 text-gray-400 cursor-pointer" />
        </h2>
        <p className="text-gray-600 flex items-center justify-center">
          @{username}
          <Pencil className="w-4 h-4 ml-2 text-gray-400 cursor-pointer" />
        </p>
      </div>
      <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 mb-4">
        Preview Bonas Profile
      </button>
      <hr className="border-gray-200 mb-4" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            From
          </span>
          <span className="text-gray-500 font-semibold">{location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            Member since
          </span>
          <span className="text-gray-500 font-semibold">{memberSince}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
