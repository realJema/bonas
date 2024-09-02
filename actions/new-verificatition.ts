"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificationToken";
import prisma from "@/prisma/client";

export const newVerification = async (token: string , password?: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);


  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  const user = await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  // Create a session for the user
  await signIn("credentials", {
    email: user.email,
    password: password,
    redirect: false,
  });

  console.log('registered users unhashed password: ',password);
  console.log("email verified user: ", user);


  return { success: true, user };
};
