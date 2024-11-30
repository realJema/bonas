// components/UserAvatar.tsx
import Image from "next/image";

interface UserAvatarProps {
  name: string | null | undefined;
  image: string | null | undefined;
  size?: number;
}

export function UserAvatar({ name, image, size = 38 }: UserAvatarProps) {
  const initials = formatInitials(name);

  if (image) {
    return (
      <Image
        src={image}
        alt={name || 'User'}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div 
      className="flex items-center justify-center rounded-full bg-blue-500 text-white"
      style={{ width: size, height: size }}
    >
      <span className="text-sm font-medium">{initials}</span>
    </div>
  );
}

function formatInitials(name: string | null | undefined): string {
  if (!name) return "AN";
  
  const names = name.trim().split(/\s+/);
  
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  
  return (names[0][0] + names[1][0]).toUpperCase();
}