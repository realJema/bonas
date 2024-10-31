import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Props {
  name: string;
  offlineTime: string;
  averageResponseTime: string;
  image: string;
}

const ProfileCard = ({ name, offlineTime, averageResponseTime , image}: Props) => {
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
    <div className="max-w-sm w-full rounded-lg bg-white shadow-sm p-4">
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-4">
          <Button className="text-base font-medium py-4 bg-white text-black hover:bg-gray-50 hover:opacity-75">
            More about me
          </Button>
          <Button className="bg-white hover:text-gray-600 text-black hover:bg-gray-50 hover:opacity-75 transition-colors">
            <Heart size={20} />
          </Button>
        </div>
      </div>

      <div className="border p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full">
            {/* Profile Image with Fallback */}
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-4 border-white shadow-sm">
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
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-gray-500">Offline • {offlineTime}</p>
          </div>
        </div>

        <button className="w-full bg-gray-950 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 mb-4 hover:bg-gray-800 hover:opacity-75">
          <span className="text-sm">Contact me</span>
        </button>

        <p className="text-sm text-gray-500 text-center">
          Average response time: {averageResponseTime}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
