import Image from "next/image";
import React from "react";
import { MapPin, MessageCircle } from "lucide-react";
import PublishedCard from "./PublishedCard";
import Link from "next/link";
import CategoryButton from "./CategoryButton";
import Reviews from "../../../../../components/Reviews";
import SearchReviews from "../../../../../components/SearchReviews";
import ReviewCard, {
  ReviewCardItems,
} from "../../../../../components/ReviewCard";
import InfoRow from "./InfoRow";
import prisma from "@/prisma/client";

interface ImageData {
  id: number;
  listingId: number;
  imageUrl: string;
  createdAt: Date;
}

interface Props {
  image: string;
  description: string;
  rating?: number;
  username: string;
  location: string;
  datePosted: Date;
  price: string | number | null;
  listingImage: ImageData[];
  isFrench?: boolean;
  categoryId: number | null;
  category: string;
  title: string;
}

const sampleReviews: ReviewCardItems[] = [
  {
    name: "John Doe",
    location: "New York, USA",
    createdAt: new Date("2023-06-15"),
    rating: 5,
    comment:
      "Excellent service! The gig was completed quickly and the quality exceeded my expectations. I highly recommend this seller.",
  },
  {
    name: "Jane Smith",
    location: "London, UK",
    createdAt: new Date("2023-07-02"),
    rating: 4,
    comment:
      "Very good work overall. There were a few minor issues, but the seller was quick to address them. I would use their services again.",
  },
  {
    name: "Alex Johnson",
    location: "Sydney, Australia",
    createdAt: new Date("2023-07-20"),
    rating: 5,
    // This review doesn't have a comment
  },
];

const Gig = async ({
  image,
  description,
  rating,
  username,
  location,
  price,
  datePosted,
  listingImage,
  isFrench = false,
  categoryId,
  category,
  title,
}: Props) => {
  // Fetch sibling sub-sub categories
  const siblingCategories = await prisma.category.findMany({
    where: {
      parentId: categoryId,
    },
    select: {
      name: true,
    },
  });

  // const categoryNames = siblingCategories.map(cat => cat.name);
  const categoryNames = [
    category, // Current category first
    ...siblingCategories
      .map((cat) => cat.name)
      .filter((name) => name !== category),
  ];

  return (
    <div>
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <div className="w-full">
            {/* Title */}
            <div className="text-lg font-bold text-black mb-4 p-2 max-w-3xl">
              {title}
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.4399 6.18829C15.4399 6.34779 15.3228 6.49843 15.2056 6.61362L11.9333 9.75044L12.7085 14.181C12.7176 14.243 12.7176 14.2961 12.7176 14.3582C12.7176 14.5886 12.6094 14.8012 12.348 14.8012C12.2218 14.8012 12.0956 14.7569 11.9874 14.6949L7.93994 12.6037L3.89246 14.6949C3.77528 14.7569 3.65809 14.8012 3.53189 14.8012C3.27047 14.8012 3.15328 14.5886 3.15328 14.3582C3.15328 14.2961 3.1623 14.243 3.17131 14.181L3.94655 9.75044L0.665302 6.61362C0.557129 6.49843 0.439941 6.34779 0.439941 6.18829C0.439941 5.92246 0.719389 5.81613 0.94475 5.78068L5.46999 5.13382L7.49824 1.10204C7.57937 0.933682 7.73261 0.738739 7.93994 0.738739C8.14727 0.738739 8.30052 0.933682 8.38164 1.10204L10.4099 5.13382L14.9351 5.78068C15.1515 5.81613 15.4399 5.92246 15.4399 6.18829Z"
                  fill="#404145"
                />
              </svg>
              <span className="text-black font-medium">{rating}</span>
              <span className="text-black opacity-75 ml-1">(8)</span>
            </div>

            {/* Profile info */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative h-24 w-24">
                <Image
                  src={image}
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                  alt="User profile image"
                />
              </div>
              <InfoRow
                isFrench={false}
                location={location}
                ordersCompleted={18}
                username={username}
              />
            </div>

            {/* Listing images */}
            <div className="space-y-4">
              {listingImage.length > 0 && (
                <div className="h-96 md:h-[400px] relative w-full md:w-[90%]">
                  <Image
                    alt={`Main listing image for listing ${listingImage[0].listingId}`}
                    src={listingImage[0].imageUrl}
                    fill
                    className="rounded-md object-cover"
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {listingImage.slice(1, 7).map((img) => (
                  <div key={img.id} className="aspect-square relative">
                    <Image
                      alt={`Listing image ${img.id} for listing ${img.listingId}`}
                      src={img.imageUrl}
                      fill
                      className="rounded-md object-cover"
                      sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 16vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PublishedCard for mobile to lg screens */}
          <div className="lg:hidden mt-8 w-full sm:max-w-3xl">
            <PublishedCard
              location={location}
              price={price}
              datePosted={datePosted}
            />
          </div>

          <div className="flex-col gap-3 w-full max-w-xl mt-6">
            {/* Description */}
            <h2 className="font-bold mb-1">{description}</h2>
            <p className="text-gray-500 mb-5">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea ipsum
              itaque voluptatibus sed totam accusamus commodi delectus iure
              porro culpa! Necessitatibus expedita dolor nisi, eaque deserunt
              ipsam
            </p>
            {/* read more  */}
            <div className="mb-3">
              <Link href="#" className="text-black underline text-lg">
                Read more
              </Link>
            </div>

            {/* categories */}
            <div className="flex flex-wrap gap-3 mt-4">
              {categoryNames.map((cat, index) => (
                <CategoryButton key={index} label={cat} />
              ))}
            </div>

            {/* Reviews */}
            <div className="flex-col space-y-4 mt-6">
              <Reviews className="w-full max-w-3xl mx-auto mt-8 px-3 sm:px-4 lg:px-5 " />
              {/* search reviews */}
              <SearchReviews />
              {/* sort reviews */}
              <div>Sort By MostRelevant</div>
              {/**use a shevron down icon dropdown or what you think is best from shadcn ui and include all recommemded sorting options */}
              <div className="space-y-4">
                {sampleReviews.map((review, index) => (
                  <ReviewCard key={index} {...review} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PublishedCard for lg screens and above */}
        <div className="hidden lg:block lg:col-span-1">
          <PublishedCard
            location={location}
            price={price}
            datePosted={datePosted}
          />
        </div>
      </div>
    </div>
  );
};

export default Gig;
