import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";


export async function fetchAllJobListings(): Promise<
  ExtendedListing[]
> {
  "use server";

  try {
    const jobsCategory = await prisma.category.findFirst({
      where: { name: "Jobs" },
    });

    if (!jobsCategory) {
      throw new Error("Jobs category not found");
    }

    const jobListings = await prisma.listing.findMany({
      where: {
        OR: [
          { categoryId: jobsCategory.id },
          { category: { parentId: jobsCategory.id } },
        ],
      },
      include: {
        category: true,
        user: true,
        images: true,
      },
    });

    // Convert Decimal to string for serialization
    return jobListings.map((listing) => ({
      ...listing,
      price: listing.price?.toString() || "0",
    }));
  } catch (error) {
    console.error("Error fetching job listings:", error);
    throw error;
  }
}
