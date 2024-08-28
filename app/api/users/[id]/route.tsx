import { NextRequest, NextResponse } from "next/server";
import schema from '../schema'
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!user) return NextResponse.json({ message: "User Not found" });

  return NextResponse.json(user);
}


export async function PUT(
  request: NextRequest,
  { params: { id } }: { params: { id: number } }
) {
   
  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, {status: 400})

  if (id > 10)
    return NextResponse.json({error: 'User Not Found' }, {status: 404})

  return NextResponse.json({id: 1, name: body.name})
}