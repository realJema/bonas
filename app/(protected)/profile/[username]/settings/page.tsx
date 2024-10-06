import { auth } from "@/auth";
import { formatUsername } from "@/utils/formatUsername";
import SettingsPageSidebar from "./SettingsPageSidebar";

const SettingsPage = async () => {
  const session = await auth();
  const formattedUsername = formatUsername(session!.user!.name);

  return (
    <div>
      <SettingsPageSidebar username={formattedUsername} />
    </div>
  );
};

export default SettingsPage;
