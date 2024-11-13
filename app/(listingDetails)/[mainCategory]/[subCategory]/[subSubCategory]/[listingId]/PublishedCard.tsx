// components/PublishedCard.tsx
import React from "react";
import { formatPrice } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Check, ArrowRight } from "lucide-react";

interface Props {
  datePosted: Date;
  price: string | null;
  location: string;
  currency?: string | null;
  isFrench?: boolean;
}

const PublishedCard = ({
  datePosted,
  price,
  location,
  currency = "USD",
  isFrench = false,
}: Props) => {
  const getDaysSincePosting = (datePosted: Date) => {
    const postedDate = new Date(datePosted);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formattedPrice = price
    ? formatPrice(price)
    : "Price not specified";

  return (
    <div className="p-6 md:sticky md:top-[50px] bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <h2 className="font-bold">
            {isFrench ? "Publié il y a" : "Published:"}{" "}
            {getDaysSincePosting(datePosted)} {isFrench ? "jours" : "days ago"}
          </h2>
          <span className="font-bold">{formattedPrice}</span>
        </div>

        <p className="text-black/60">
          {isFrench
            ? "Nous promouvons votre newsletter pendant 10 jours plus SEO"
            : "We promote your News Letter for 10 days plus SEO"}
        </p>

        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-black/55" />
          <span className="text-black/55">
            {isFrench ? "Livraison en 10 jours" : "10 day delivery"}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-black" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-black" />
            <span className="text-black/50">
              {isFrench ? "Temps plein" : "Full Time"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-black" />
            <span className="text-black/50">{isFrench ? "Homme" : "Male"}</span>
          </div>
        </div>

        <Button className="w-full py-4 bg-black text-white hover:opacity-80 transition-opacity flex justify-between items-center">
          <span>{isFrench ? "Voir plus" : "Show more"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="mt-12 bg-gray-200 p-4 rounded-md">
          <button className="border border-black text-black bg-white w-full py-2 rounded-md">
            {isFrench ? "Contacter l'annonceur" : "Contact Advertiser"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishedCard;
