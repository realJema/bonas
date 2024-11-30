import React, { useState } from "react";
import { formatPrice } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, ArrowRight, Truck, PhoneCall, Mail } from "lucide-react";

interface Props {
  datePosted: Date;
  price: string | null;
  location: string;
  currency?: string | null;
  isFrench?: boolean;
  deadline: Date | null;
  userPhoneNumber?: string | null;
  userEmail?: string | null;
  deliveryAvailable?: string | null;
  negotiable?: string | null;
  condition?: string | null;
}

const PublishedCard = ({
  datePosted,
  price,
  location,
  currency = "USD",
  isFrench = false,
  deadline,
  userPhoneNumber,
  userEmail,
  deliveryAvailable,
  negotiable,
  condition,
}: Props) => {
  const [showContact, setShowContact] = useState(false);

  const getDaysSincePosting = (datePosted: Date) => {
    const postedDate = new Date(datePosted);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formattedPrice = price ? formatPrice(price) : "Price not specified";

  return (
    <div className="p-6 md:sticky md:top-[50px] bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <h2 className="font-bold">
            {isFrench ? "Publié il y a" : "Published:"}{" "}
            {getDaysSincePosting(datePosted)} {isFrench ? "jours" : "days ago"}
          </h2>
          <span className="font-bold">{formattedPrice}</span>
        </div>

        {deadline && (
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-black/55" />
            <span className="text-black/55">{deadline.toDateString()}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Check size={16} className="text-black" />
            <span>{location}</span>
          </div>

            {deliveryAvailable && (
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-black" />
                <Badge variant="outline" className="flex items-center gap-1">
                  <Truck size={14} />
                  Delivery Available
                </Badge>
              </div>
            )}

            {negotiable && (
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-black" />
                <Badge variant="outline" className="bg-green-50">
                  Price Negotiable
                </Badge>
              </div>
            )}

            {condition && (
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-black" />
                <Badge variant="secondary" className="capitalize">
                  {condition}
                </Badge>
              </div>
            )}
        </div>

        <div className="mt-8 bg-gray-100 p-4 rounded-md">
          <button
            className="border border-black text-black bg-white w-full py-2 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setShowContact(!showContact)}
          >
            {isFrench ? "Contacter l'annonceur" : "Contact Advertiser"}
          </button>

          {showContact && (
            <div className="mt-4 space-y-3">
              {userEmail && (
                <div className="flex items-center space-x-2 text-sm">
                  <Mail size={16} className="text-gray-600" />

                  {userEmail}
                </div>
              )}
              {userPhoneNumber && (
                <div className="flex items-center space-x-2 text-sm">
                  <PhoneCall size={16} className="text-gray-600" />

                  {userPhoneNumber}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishedCard;

// // components/PublishedCard.tsx
// import React, { useState } from "react";
// import { formatPrice } from "@/utils/formatUtils";
// import { Button } from "@/components/ui/button";
// import { Clock, Check, ArrowRight } from "lucide-react";

// interface Props {
//   datePosted: Date;
//   price: string | null;
//   location: string;
//   currency?: string | null;
//   isFrench?: boolean;
//   deadline: Date | null;
//   userPhoneNumber?: string | null;
//   userEmail?: string | null;
//   deliveryAvailable?: string | null;
//   negotiable?: string | null;
//   condition?: string | null;
// }

// const PublishedCard = ({
//   datePosted,
//   price,
//   location,
//   currency = "USD",
//   isFrench = false,
//   deadline,
//   userPhoneNumber,
//   userEmail,
//   deliveryAvailable,
//   negotiable,
//   condition,
// }: Props) => {
//   const [showContact, setShowContact] = useState(false);

//   const getDaysSincePosting = (datePosted: Date) => {
//     const postedDate = new Date(datePosted);
//     const currentDate = new Date();
//     const diffTime = Math.abs(currentDate.getTime() - postedDate.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const formattedPrice = price ? formatPrice(price) : "Price not specified";

//   return (
//     <div className="p-6 md:sticky md:top-[50px] bg-white shadow-md rounded-lg border border-gray-200">
//       <div className="flex flex-col space-y-4">
//         <div className="flex flex-col sm:flex-row items-center justify-between">
//           <h2 className="font-bold">
//             {isFrench ? "Publié il y a" : "Published:"}{" "}
//             {getDaysSincePosting(datePosted)} {isFrench ? "jours" : "days ago"}
//           </h2>
//           <span className="font-bold">{formattedPrice}</span>
//         </div>

//         {deadline && (
//           <div className="flex items-center space-x-2">
//             <Clock size={16} className="text-black/55" />
//             <span className="text-black/55">{deadline.toDateString()}</span>
//           </div>
//         )}

//         <div className="space-y-2">
//           <div className="flex items-center space-x-2">
//             <Check size={16} className="text-black" />
//             <span>{location}</span>
//           </div>
//           {deliveryAvailable && (
//             <div className="flex items-center space-x-2">
//               <Check size={16} className="text-black" />
//               <span className="text-black/50">
//                 Delivery availability: {deliveryAvailable}
//               </span>
//             </div>
//           )}
//           {negotiable && (
//             <div className="flex items-center space-x-2">
//               <Check size={16} className="text-black" />
//               <span className="text-black/50">Price negotiable</span>
//             </div>
//           )}
//           {condition && (
//             <div className="flex items-center space-x-2">
//               <Check size={16} className="text-black" />
//               <span className="text-black/50">Condition: {condition}</span>
//             </div>
//           )}
//         </div>

//         {/* <Button className="w-full py-4 bg-black text-white hover:opacity-80 transition-opacity flex justify-between items-center">
//           <span>{isFrench ? "Voir plus" : "Show more"}</span>
//           <ArrowRight className="h-4 w-4" />
//         </Button> */}

//         <div className="mt-12 bg-gray-200 p-4 rounded-md">
//           <button
//             className="border border-black text-black bg-white w-full py-2 rounded-md"
//             onClick={() => setShowContact(!showContact)}
//           >
//             {isFrench ? "Contacter l'annonceur" : "Contact Advertiser"}
//           </button>
//           {showContact && (
//             <div className="mt-4 space-y-2">
//               {userEmail && (
//                 <p className="text-sm">
//                   <span className="font-semibold">Email:</span> {userEmail}
//                 </p>
//               )}
//               {userPhoneNumber && (
//                 <p className="text-sm">
//                   <span className="font-semibold">Phone:</span>{" "}
//                   {userPhoneNumber}
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PublishedCard;
