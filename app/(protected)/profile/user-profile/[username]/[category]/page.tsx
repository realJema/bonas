import { auth } from "@/auth";
import UserProfile from "./UserProfile";
import ProfileCard from "./ProfileCard";

interface Props {
  params: { username: string; category: string };
}

const UsersProfile = async ({ params: { username, category } }: Props) => {
  const session = await auth();
  const name = session?.user?.name || "";
  const skills = [
    "Digital marketer",
    "SEO expert",
    "Social media marketer",
    "Content writer",
  ];
  const bio =
    "Writer on Medium & Vocal. Know a bit about Search Engine Optimization, getting over 100,000 views in the last 30 days. Writing online is powerful and I could help you write better. My articles are search optimized so I would help you to get more organic traffic for a lifetime.";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area - takes up 2/3 on desktop */}
        <div className="lg:col-span-2 space-y-6">
          <UserProfile
            username={username}
            name={name}
            image={session?.user?.image || ""}
            skills={skills}
            bio={bio}
            location="Pakistan"
          />
        </div>

        {/* Sidebar area - takes up 1/3 on desktop */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ProfileCard
              name={name}
              offlineTime="03:16 PM local time"
              averageResponseTime="6 hours"
              image={session?.user?.image || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersProfile;
