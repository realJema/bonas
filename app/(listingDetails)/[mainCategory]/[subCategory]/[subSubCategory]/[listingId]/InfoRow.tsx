import React from "react";
import { MapPin, MessageCircle } from "lucide-react";

interface Props {
  username: string;
  location: string;
  isFrench: boolean;
  ordersCompleted: number;
}

const InfoRow = ({ username, location, isFrench, ordersCompleted }: Props) => {
  return (
    <div className="space-y-4">
      <span className="font-medium">{username}</span>
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span className="whitespace-nowrap">{location} /</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={16} />
          <p>{isFrench ? "parle français" : "speaks English"}</p>
        </div>
        <span>{ordersCompleted} orders completed</span>
      </div>
      <button className="bg-white text-black text-opacity-75 border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
        Contact me
      </button>
    </div>
  );
};

export default InfoRow;
