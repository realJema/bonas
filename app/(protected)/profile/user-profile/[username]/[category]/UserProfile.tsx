import Image from "next/image";
import React from "react";
import SkillButton from "./SkillButton";
import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  image?: string;
  location: string;
  username: string;
  name: string;
  bio: string;
  skills: string[];
}

const UserProfile = ({
  image,
  location,
  username,
  name,
  bio,
  skills,
}: Props) => {
  // Get initials from the name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        {/* Profile Image with Fallback */}
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-sm">
          {image ? (
            <AvatarImage
              src={image}
              alt={`${name}'s profile`}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="text-2xl font-semibold bg-gray-100">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex-1">
          {/* Name and Username */}
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-gray-900">{name}</h1>
            <span className="text-gray-500 text-sm">@{username}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-current text-gray-900" />
            <span className="font-medium">4.7</span>
            <span className="text-gray-500 text-sm">(50)</span>
          </div>

          {/* Tagline */}
          <p className="text-gray-700 mb-3">
            Have skin in the game in Newsletter Industry and everything about it
          </p>

          {/* Location and Language */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <span>🌍</span>
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">About me</h2>
        <p className="text-gray-700 leading-relaxed">{bio}</p>
      </div>

      {/* Skills Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <SkillButton key={skill} label={skill} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
