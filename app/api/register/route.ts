import prisma from "@/prisma/client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

const schema = z.object({
  email: z.string().min(5, {message: 'Invalid email address'}),
  password: z
    .string()
    .min(5, { message: "password must be at least 5 characters" })
    .max(225),
  name: z.string().min(3, { message: "name must be at least 3 characters" }),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = schema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (user)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: body.email,
      passwordHash: hashedPassword,
      name: body.name,
    },
  });

  return NextResponse.json({ email: newUser.email });
}
