import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    // Fetch all categories
    const allCategories = await prisma.category.findMany({
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    // Filter to get only the top-level categories (those with no parent)
    const mainCategories = allCategories.filter(
      (category) => category.parentId === null
    );
    
    return NextResponse.json(mainCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
