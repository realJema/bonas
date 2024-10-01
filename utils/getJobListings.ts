import { getListings } from "./getListings";

export const maxDuration = 60;

export async function getJobListings() {
  "use server";
  // Using the general getListings function to fetch job listings
  const { listings } = await getListings({
    mainCategory: "Jobs",
    page: 1,
    pageSize: 10,
  });

  return listings;
}
