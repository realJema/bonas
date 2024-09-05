import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";

export async function getRealEstateListings(): Promise<ExtendedListing[]> {
  "use server";

  try {
    const realEstateCategory = await prisma.category.findFirst({
      where: { name: "Real Estate" },
    });

    if (!realEstateCategory) {
      throw new Error("Real Estate category not found");
    }

    const realEstateListings = await prisma.listing.findMany({
      where: {
        OR: [
          { categoryId: realEstateCategory.id },
          { category: { parentId: realEstateCategory.id } },
        ],
      },
      include: {
        category: true,
        user: true,
        images: true,
      },
    });

    // Convert Decimal to string for serialization
    return realEstateListings.map((listing) => ({
      ...listing,
      price: listing.price?.toString() || "0",
    }));
  } catch (error) {
    console.error("Error fetching real estate listings:", error);
    throw error;
  }
}
