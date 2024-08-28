import { NextResponse } from "next/server";

export async function GET() {
  // Your GET logic here
  return NextResponse.json({ message: "Hello from the jobs API route" });
}

export async function POST() {
  // Your POST logic here
  return NextResponse.json({ message: "Job posted successfully" });
}
