import React from "react";
import { formatPrice } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Check, ArrowRight } from "lucide-react";

interface Props {
  datePosted: Date;
  price: string;
  location: string;
}

const PublishedCard = ({ datePosted, price, location }: Props) => {
  // Function to calculate days since posting
  const getDaysSincePosting = (datePosted: Date) => {
    const postedDate = new Date(datePosted);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6 md:sticky md:top-[50px] bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex flex-col space-y-4">
        <div className="flex-col md:flex-row items-center justify-between">
          <h2 className="font-bold">
            Published: {getDaysSincePosting(datePosted)} days ago
          </h2>
          <span className="font-bold">{formatPrice(price)}</span>
        </div>

        <p className="text-black/60">
          We promote your News Letter for 10 days plus SEO
        </p>

        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-black/55" />
          <span className="text-black/55">10 day delivery</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-black" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-black" />
            <span className="text-black/50">Full Time</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-black" />
            <span className="text-black/50">Male</span>
          </div>
        </div>

        <Button className="w-full bg-black text-white hover:opacity-80 transition-opacity flex justify-between items-center">
          <span>Show more</span>
          <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="mt-12 bg-gray-200 p-4 rounded-md">
          <button className="border border-black text-black bg-white w-full py-2 rounded-md">
            Contact Advertiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishedCard;
