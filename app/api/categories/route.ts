// app/api/categories/route.ts
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const parentId = searchParams.get("parentId");

   const headers = {
     "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
     "Content-Type": "application/json",
   };

    // For header navigation - fetch full tree
    if (type === "all") {
      const mainCategories = await prisma.category.findMany({
        where: {
          parentId: null,
        },
        select: {
          id: true,
          name: true,
          description: true,
          children: {
            select: {
              id: true,
              name: true,
              description: true,
              children: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      });

      return NextResponse.json(mainCategories, { headers });
    }

    // For Step2 - fetch based on parentId
    if (parentId) {
      const childCategories = await prisma.category.findMany({
        where: {
          parentId: parseInt(parentId),
        },
        select: {
          id: true,
          name: true,
          description: true,
          parentId: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      return NextResponse.json(childCategories, { headers });
    }

    // Default - return main categories
    const mainCategories = await prisma.category.findMany({
      where: {
        parentId: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(mainCategories, { headers });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
