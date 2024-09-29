import { getListings } from "./getListings";

export const maxDuration = 60;

export async function getRealEstateListings() {
  "use server";
  const { listings } = await getListings({
    mainCategory: "Real Estate",
    page: 1,
    pageSize: 10,
  });

  return listings;
}
