import prisma from '@/prisma/client'
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const towns = await prisma.towns.findMany({
      where: {
        is_featured: true,
        active_listings: {
          gt: 0,
        },
      },
      select: {
        id: true,
        name: true,
        region: true,
        country: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(towns);
  } catch (error) {
    console.error('Error fetching towns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch towns' },
      { status: 500 }
    );
  }
}