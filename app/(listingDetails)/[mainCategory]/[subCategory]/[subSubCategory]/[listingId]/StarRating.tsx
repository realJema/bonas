import { Star, StarHalf } from "lucide-react";

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-black fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 text-black fill-current" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={i + fullStars} className="w-4 h-4 text-black" />
      ))}
    </div>
  );
};

export default StarRating;
