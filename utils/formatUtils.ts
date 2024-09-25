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
