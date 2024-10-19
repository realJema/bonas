import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Get authenticated session
    const session = await auth();

    // 2. Check if user is authenticated and has an ID
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

    // 4. Parse request body
    const body = await request.json();
    console.log("Received body:", body);

    const { title, description, category, location, timeline, budget } = body;

    // 5. Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 6. Get category ID
    const categoryData = await prisma.category.findFirst({
      where: { name: category },
      select: { id: true },
    });

    if (!categoryData) {
      return NextResponse.json(
        { error: `Category '${category}' not found` },
        { status: 400 }
      );
    }

    // 7. Create listing with verified user ID
  const listing = await prisma.listing.create({
    data: {
        title,
        description,
        location,
        timeline,
        budget: parseFloat(budget),
        categoryId: categoryData.id,
        userId: user.id,
    },
  });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);

    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import prisma from "@/prisma/client";
// import { auth } from "@/auth";
// import { ListingSchema } from "@/schemas";

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
//     console.log("Received body:", body);

//     // 5. Validate with Zod schema
//     const validatedData = ListingSchema.safeParse(body);

//     if (!validatedData.success) {
//       return NextResponse.json(
//         { error: "Invalid input", details: validatedData.error.errors },
//         { status: 400 }
//       );
//     }

//     const {
//       title,
//       description,
//       category,
//       subcategories,
//       location,
//       timeline,
//       budget,
//       price,
//     } = validatedData.data;

//     // 6. Get category ID
//     const categoryData = await prisma.category.findFirst({
//       where: { name: category },
//       include: {
//         children: {
//           where: {
//             name: {
//               in: subcategories || [],
//             },
//           },
//           select: { id: true },
//         },
//       },
//     });

//     if (!categoryData) {
//       return NextResponse.json(
//         { error: `Category '${category}' not found` },
//         { status: 400 }
//       );
//     }

//     // 7. Create listing with verified user ID and category
//     const listing = await prisma.listing.create({
//       data: {
//         title,
//         description,
//         location,
//         timeline,
//         budget,
//         price,
//         categoryId: categoryData.id,
//         userId: user.id,
//       },
//       include: {
//         category: true,
//         user: {
//           select: {
//             name: true,
//             email: true,
//             image: true,
//           },
//         },
//         images: true,
//       },
//     });

//     return NextResponse.json(listing, { status: 201 });
//   } catch (error) {
//     console.error("Error creating listing:", error);

//     if (error instanceof Error) {
//       return NextResponse.json(
//         { error: "Failed to create listing", message: error.message },
//         { status: 500 }
//       );
//     }

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

//     const {
//       title,
//       description,
//       category,
//       subcategories,
//       location,
//       timeline,
//       budget,
//     } = body;

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
//       include: {
//         children: {
//           where: {
//             name: {
//               in: subcategories || [],
//             },
//           },
//           select: { id: true },
//         },
//       },
//     });

//     if (!categoryData) {
//       return NextResponse.json(
//         { error: `Category '${category}' not found` },
//         { status: 400 }
//       );
//     }

//     // 7. Create listing with verified user ID and subcategories
//     const listing = await prisma.listing.create({
//       data: {
//         title,
//         description,
//         location,
//         timeline,
//         budget: parseFloat(budget),
//         categoryId: categoryData.id,
//         userId: user.id,
//         subcategories: {
//           connect: categoryData.children.map((child) => ({ id: child.id })),
//         },
//       },
//       include: {
//         subcategories: true,
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
