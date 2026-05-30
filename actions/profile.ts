"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── Avatar upload ─────────────────────────────────────────────────────────

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export type AvatarState = { message?: string; error?: string };

export async function updateAvatarAction(
  _prev: AvatarState,
  formData: FormData,
): Promise<AvatarState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) return { error: "No file selected." };
  if (!ALLOWED_TYPES.has(file.type))
    return { error: "Only JPEG, PNG, WebP, or GIF images are allowed." };
  if (file.size > MAX_SIZE) return { error: "File must be under 5 MB." };

  const ext = extname(file.name).toLowerCase() || ".jpg";
  // Sanitize: filename is just the user ID + extension — no user-controlled input in path
  const filename = `${session.user.id}${ext}`;
  const uploadsDir = join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(uploadsDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

  const imageUrl = `/uploads/avatars/${filename}`;
  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  });

  revalidatePath("/account");
  revalidatePath("/", "layout"); // refresh header on all pages
  return { message: "Profile picture updated." };
}

// ─── Profile info update ───────────────────────────────────────────────────

const ProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name is too long."),
  phone: z.string().max(30, "Phone is too long.").optional().or(z.literal("")),
});

export type ProfileState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Not authenticated." };

  const parsed = ProfileSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
    },
  });

  revalidatePath("/account");
  revalidatePath("/", "layout");
  return { message: "Profile updated successfully." };
}
