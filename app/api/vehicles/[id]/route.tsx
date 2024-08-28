import { NextRequest, NextResponse } from "next/server";


export function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: number } }
): NextResponse {
  if(id > 10) 
    return NextResponse.json({ message: "User Not found" });

   return NextResponse.json({id: 1 , name: "md christien"})
}
