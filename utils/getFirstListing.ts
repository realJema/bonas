// utils/getListing.ts

import prisma from "@/prisma/client";

export async function getFirstListing() {
  try {
    const listing = await prisma.listing.findFirst({
      where: {
        status: 'active', // Assuming you want active listings
      },
      include: {
        user: {
          select: {
            name: true,
            profilImage: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return listing;
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}