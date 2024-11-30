import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useState } from "react";

const ImageGallery = ({
  listingImages,
  coverImage,
}: {
  listingImages: string[];
  coverImage?: string;
}) => {
  const [selectedImage, setSelectedImage] = useState(
    coverImage || listingImages[0]
  );
  const allImages = coverImage
    ? [coverImage, ...listingImages.filter((img) => img !== coverImage)]
    : listingImages;

  return (
    <div className="space-y-4">
      <div className="h-96 md:h-[400px] relative w-full md:w-[90%] rounded-md">
        <Image
          alt="Selected listing image"
          src={selectedImage}
          fill
          quality={100}
          priority
          className="rounded-md object-cover bg-gray-50"
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 80vw"
        />
      </div>
      <ScrollArea className="h-20">
        <div className="flex space-x-2 w-full">
          {allImages.map((img, index) => (
            <div
              key={index}
              className="aspect-square relative cursor-pointer flex-shrink-0 w-20"
              onClick={() => setSelectedImage(img)}
            >
              <Image
                alt={`Listing image ${index + 1}`}
                src={img}
                fill
                quality={80}
                className={`rounded-md object-cover transition-all ${
                  selectedImage === img
                    ? "border-2 border-blue-500 ring-2 ring-blue-300"
                    : "hover:opacity-80"
                }`}
                sizes="80px"
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ImageGallery;
