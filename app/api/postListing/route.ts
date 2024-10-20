import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { CreateListingInput, CreateListingSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    // 1. Get authenticated session
    const session = await auth();

    // 2. Check if user is authenticated and has an email
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // 3. Get user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Parse and validate request body
    const body = await request.json();
    console.log("Received body:", body); // Add this for debugging

    try {
      const validatedData = CreateListingSchema.parse(body);

      // 5. Get category ID
      const categoryData = await prisma.category.findFirst({
        where: { name: validatedData.category },
        select: { id: true },
      });

      if (!categoryData) {
        return NextResponse.json(
          { error: `Category '${validatedData.category}' not found` },
          { status: 400 }
        );
      }

      // 6. Handle profile image if provided
      if (validatedData.profileImage) {
        await prisma.user.update({
          where: { id: user.id },
          data: { profilePicture: validatedData.profileImage },
        });
      }

      // 7. Create listing with verified user ID
      const listing = await prisma.listing.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          location: validatedData.location,
          timeline: validatedData.timeline,
          budget: validatedData.budget,
          categoryId: categoryData.id,
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
              username: true,
            },
          },
          category: true,
        },
      });

      return NextResponse.json(listing, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors.map((err) => ({
              path: err.path.join("."),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

// import { auth } from "@/auth";
// import prisma from "@/prisma/client";
// import { CreateListingInput, CreateListingSchema } from "@/schemas";
// import { NextResponse } from "next/server";
// import { z } from "zod";

// export async function POST(request: Request) {
//   try {
//     // 1. Get authenticated session
//     const session = await auth();

//     // 2. Check if user is authenticated and has an email
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized - Please sign in" },
//         { status: 401 }
//       );
//     }

//     // 3. Get user from database using email
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // 4. Parse and validate request body
//     const body = await request.json();
//     let validatedData: CreateListingInput;

//     try {
//       validatedData = CreateListingSchema.parse(body);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return NextResponse.json({ error: error.errors }, { status: 400 });
//       }
//       throw error;
//     }

//     // 5. Get category ID
//     const categoryData = await prisma.category.findFirst({
//       where: { name: validatedData.category },
//       select: { id: true },
//     });

//     if (!categoryData) {
//       return NextResponse.json(
//         { error: `Category '${validatedData.category}' not found` },
//         { status: 400 }
//       );
//     }

//     // 6. Handle profile image if provided
//     if (validatedData.profileImage) {
//       await prisma.user.update({
//         where: { id: user.id },
//         data: { profilePicture: validatedData.profileImage },
//       });
//     }

//     // 7. Create listing with verified user ID
//     const listing = await prisma.listing.create({
//       data: {
//         title: validatedData.title,
//         description: validatedData.description,
//         location: validatedData.location,
//         timeline: validatedData.timeline,
//         budget: validatedData.budget,
//         categoryId: categoryData.id,
//         userId: user.id,
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             profilePicture: true,
//             username: true,
//           },
//         },
//         category: true,
//       },
//     });

//     return NextResponse.json(listing, { status: 201 });
//   } catch (error) {
//     console.error("Error creating listing:", error);
//     return NextResponse.json(
//       { error: "Failed to create listing" },
//       { status: 500 }
//     );
//   }
// }

// import { auth } from "@/auth";
// import prisma from "@/prisma/client";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     // 1. Get authenticated session
//     const session = await auth();

//     // 2. Check if user is authenticated and has an ID
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized - Please sign in" },
//         { status: 401 }
//       );
//     }

//     // 3. Get user from database using email
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // 4. Parse request body
//     const body = await request.json();
//     console.log("Received body:", body);

//     const { title, description, category, location, timeline, budget } = body;

//     // 5. Validate required fields
//     if (!title || !description || !category) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // 6. Get category ID
//     const categoryData = await prisma.category.findFirst({
//       where: { name: category },
//       select: { id: true },
//     });

//     if (!categoryData) {
//       return NextResponse.json(
//         { error: `Category '${category}' not found` },
//         { status: 400 }
//       );
//     }

//     // 7. Create listing with verified user ID
//   const listing = await prisma.listing.create({
//     data: {
//         title,
//         description,
//         location,
//         timeline,
//         budget: parseFloat(budget),
//         categoryId: categoryData.id,
//         userId: user.id,
//     },
//   });

//     return NextResponse.json(listing, { status: 201 });
//   } catch (error) {
//     console.error("Error creating listing:", error);

//     return NextResponse.json(
//       { error: "Failed to create listing" },
//       { status: 500 }
//     );
//   }
// }
