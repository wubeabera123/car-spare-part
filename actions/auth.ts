"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { SignupSchema, LoginSchema } from "@/lib/validations/auth";

export type AuthFormState =
  | {
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const normalizedEmail = parsed.data.email.toLowerCase();

  const exists = await prisma.user.findFirst({
    where: {
      email: {
        equals: normalizedEmail,
        mode: "insensitive",
      },
    },
  });
  if (exists) {
    return { message: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: normalizedEmail,
        passwordHash,
        role: "CUSTOMER",
      },
    });
  } catch (error) {
    // Guard against race conditions where another signup creates the same email.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { message: "An account with this email already exists." };
    }
    throw error;
  }

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password: parsed.data.password,
      redirect: false,
    });
  } catch {
    // Account was created; if auto sign-in fails, send user to login page instead.
    redirect("/login");
  }
  redirect("/");
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const normalizedEmail = parsed.data.email.toLowerCase();

  try {
    const result = await signIn("credentials", {
      email: normalizedEmail,
      password: parsed.data.password,
      redirect: false,
    });

    if (result && "error" in result && result.error) {
      return { message: "Invalid email or password." };
    }
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { message: "Invalid email or password." };
    }

    return { message: "Unable to sign in right now. Please try again." };
  }
  redirect("/");
}
