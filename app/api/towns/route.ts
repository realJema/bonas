import prisma from '@/prisma/client'
import { NextResponse } from "next/server";

// Helper function to convert BigInt to number
const serializeTown = (town: any) => ({
  ...town,
  id: Number(town.id),
  postal_code: town.postal_code ? Number(town.postal_code) : null,
  active_listings: town.active_listings ? Number(town.active_listings) : null,
  population: town.population ? Number(town.population) : null,
  created_at: town.created_at ? town.created_at.toISOString() : null,
  updated_at: town.updated_at ? town.updated_at.toISOString() : null
});

export async function GET() {
  try {
    const towns = await prisma.town.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    // Convert BigInt values to numbers before sending response
    const serializedTowns = towns.map(serializeTown);

    return NextResponse.json(serializedTowns);
  } catch (error) {
    console.error('Error fetching towns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch towns' },
      { status: 500 }
    );
  }
}