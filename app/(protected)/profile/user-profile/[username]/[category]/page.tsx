interface Props {
  params: { username: string; category: string };
}

const UserProfile = async ({ params: { username, category } }: Props) => {
  return (
    <div>
      <div>User Profile</div>
      username: {username} , category: {category}
    </div>
  );
};

export default UserProfile;
