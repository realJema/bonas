import {
  format,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  parseISO,
} from "date-fns";


export function formatPrice(price: string | number | null): string {
  if (price === null || price === "" || price === "0.00" || price === 0) {
    return "Price not available";
  }
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  const roundedPrice = Math.round(numPrice);
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedPrice) + " FCFA";
}

export function getDisplayPrice(price: string | null, budget: number | null): string {
  if (price && price !== "" && price !== "0.00") {
    // If price is a string, we need to format it consistently
    return formatPrice(price);
  }
  return formatPrice(budget);
}

export function formatDatePosted(dateInput: Date | string | number): string {
  let date: Date;
  if (typeof dateInput === "string") {
    // If it's an ISO string, parse it
    date = parseISO(dateInput);
  } else if (typeof dateInput === "number") {
    // If it's a timestamp, create a new Date
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    // If it's already a Date object, use it as is
    date = dateInput;
  } else {
    // If it's none of the above, return an error message
    return "Invalid date";
  }

  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 3600 * 24)
  );

  if (diffInDays < 1) {
    // Use formatDistanceToNowStrict for more precise output without "about"
    const distance = formatDistanceToNowStrict(date, { addSuffix: false });
    return `${distance} ago`;
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

