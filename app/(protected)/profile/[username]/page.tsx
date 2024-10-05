
import { auth } from "@/auth";


const UserProfilePage = async() => {
  const session = await auth();

  return (
    <div>UserProfilePage
      <h1>User Profile</h1>
      <p>Welcome, {session?.user.name}!</p>
    </div>
  )
}

export default UserProfilePage