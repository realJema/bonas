import { auth } from "@/auth";

interface Props {
  params: { username: string };
}

const UserProfilePage = async ({ params: { username } }: Props) => {
  const session = await auth();

  return (
    <div className="container mx-auto px-5 md:px-4 md:max-w-7xl">
      UserProfilePage
      <h1>User Profile</h1>
      <p>Welcome, {session?.user.name}!</p>
      <p>Your username is: {username}</p>
    </div>
  );
};

export default UserProfilePage;
