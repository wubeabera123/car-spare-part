"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";
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

// ── Forgot password ───────────────────────────────────────────────────────────
export async function requestPasswordResetAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) return { message: "Email is required." };

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (!user)
    return {
      message: "If that email is registered, you will receive a reset link.",
    };

  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  try {
    const { sendPasswordResetEmail } = await import("@/lib/email");
    const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
    await sendPasswordResetEmail({
      to: user.email!,
      name: user.name ?? "User",
      resetUrl,
    });
  } catch {
    /* best-effort */
  }

  return {
    message: "If that email is registered, you will receive a reset link.",
  };
}

// ── Reset password ────────────────────────────────────────────────────────────
const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function resetPasswordAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = ResetPasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success)
    return { errors: z.flattenError(parsed.error).fieldErrors };

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
  });

  if (!record || record.used || record.expiresAt < new Date()) {
    return {
      message:
        "Reset link is invalid or has expired. Please request a new one.",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });
  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { used: true },
  });

  redirect("/login?reset=1");
}
