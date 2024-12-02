// app/api/getUploadSignature/route.ts
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Add GET handler to return 405 Method Not Allowed
export async function GET() {
  return new NextResponse("Method not allowed", { status: 405 });
}

export async function POST() {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Create params object with all parameters that need to be signed
    const params = {
      timestamp: timestamp,
      folder: "Listings",
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET, // Add this to your env variables
    };

    // Generate signature with all params
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      ...params,
      signature,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}

// // app/api/getUploadSignature/route.ts
// import { v2 as cloudinary } from "cloudinary";
// import { auth } from "@/auth";
// import { NextResponse } from "next/server";

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// export async function POST() {
//   try {
//     // Verify authentication
//     const session = await auth();
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const timestamp = Math.round(new Date().getTime() / 1000);

//     // Create params object with all parameters that need to be signed
//     const params = {
//       timestamp: timestamp,
//       folder: "Listings",
//       upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET, // Add this to your env variables
//     };

//     // Generate signature with all params
//     const signature = cloudinary.utils.api_sign_request(
//       params,
//       process.env.CLOUDINARY_API_SECRET!
//     );

//     return NextResponse.json({
//       ...params,
//       signature,
//       cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//       apiKey: process.env.CLOUDINARY_API_KEY,
//     });
//   } catch (error) {
//     console.error("Error generating signature:", error);
//     return NextResponse.json(
//       { error: "Failed to generate upload signature" },
//       { status: 500 }
//     );
//   }
// }
