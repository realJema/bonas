import { getListings } from "./getListings";

export const maxDuration = 60;

export async function getVehiclesAndMotorListings() {
  "use server";
  const { listings } = await getListings({
    mainCategory: "Vehicles",
    page: 1,
    pageSize: 10,
  });

  return listings;
}