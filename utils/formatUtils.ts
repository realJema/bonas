import { format, formatDistanceToNow } from "date-fns";

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  const roundedPrice = Math.round(numPrice);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedPrice);
}

export function formatDatePosted(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 3600 * 24)
  );

  if (diffInDays < 1) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else {
    return format(date, "MMM d, yyyy");
  }
}

export function formatUsername(username: string) {
  if (!username) return "";

  const names = username.split(" ");
  
  if (names.length > 1) {
    return `${capitalizeFirstLetter(names[0])} ${names[1][0].toUpperCase()}.`;
  } else {
    return capitalizeFirstLetter(names[0]);
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

