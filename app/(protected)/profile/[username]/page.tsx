import { auth } from "@/auth";

interface Props {
  params: { username: string };
}

const UserProfilePage = async ({ params: { username } }: Props) => {
  const session = await auth();

  return (
    <div>
      UserProfilePage
      <h1>User Profile</h1>
      <p>Welcome, {session?.user.name}!</p>
      <p>Your username is: {username}</p>
    </div>
  );
};

export default UserProfilePage;
