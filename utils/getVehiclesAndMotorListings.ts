import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";

export async function getVehiclesAndMotorListings(): Promise<
  ExtendedListing[]
> {
  "use server";

  try {
    const vehiclesAndMotorCategory = await prisma.category.findFirst({
      where: { name: "Vehicles" },
    });

    if (!vehiclesAndMotorCategory) {
      throw new Error("Vehicles and Motor category not found");
    }

    const vehiclesAndMotorListings = await prisma.listing.findMany({
      where: {
        OR: [
          { categoryId: vehiclesAndMotorCategory.id },
          { category: { parentId: vehiclesAndMotorCategory.id } },
        ],
      },
      include: {
        category: true,
        user: true,
        images: true,
      },
    });

    // Convert Decimal to string for serialization
    return vehiclesAndMotorListings.map((listing) => ({
      ...listing,
      price: listing.price?.toString() || "0",
    }));
  } catch (error) {
    console.error("Error fetching vehicles and motor listings:", error);
    throw error;
  }
}
