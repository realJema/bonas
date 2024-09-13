import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { Image } from "@prisma/client";


const DEFAULT_IMAGE: Image = {
  id: -1,
  imageUrl:
    "https://plus.unsplash.com/premium_photo-1683746792239-6ce8cdd3ac78?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  listingId: -1,
  createdAt: new Date(),
};


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
      images: listing.images.length > 0 ? listing.images : [DEFAULT_IMAGE],
    }));
  } catch (error) {
    console.error("Error fetching job listings:", error);
    throw error;
  }
}
