import { getListings } from "./getListings";

export async function getJobListings() {
  "use server";
  const { listings } = await getListings({
    mainCategory: "Jobs",
    page: 1,
    pageSize: 10,
  });

  return listings;
}


