import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Received body:", body);

    const { title, description, category, price, location } = body;

    // Create the listing
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        categoryId: parseInt(category) || 1, // Default to 1 if category is not provided
        price: price ? parseFloat(price) : null, // Use null if price is not provided
        location: location || null, // Use null if location is not provided
            userId: session.user.id, // Directly set the userId
        // createdAt and updatedAt will be handled automatically by Prisma
      },
    });

    console.log("Created listing:", listing);

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Internal Server Error", details: "An unknown error occurred" }, { status: 500 });
    }
  }
}
