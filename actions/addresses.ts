"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AddressFormState =
  | { errors?: Record<string, string[]>; message?: string; success?: boolean }
  | undefined;

const AddressSchema = z.object({
  label: z.string().max(50).optional(),
  line1: z.string().min(1, "Address line 1 is required."),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required."),
  phone: z.string().optional(),
  isDefault: z.coerce.boolean().optional(),
});

export async function createAddressAction(
  _prev: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const parsed = AddressSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success)
    return { errors: z.flattenError(parsed.error).fieldErrors };

  const d = parsed.data;
  if (d.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }
  await prisma.address.create({
    data: {
      ...d,
      userId: session.user.id,
      label: d.label ?? null,
      line2: d.line2 ?? null,
      state: d.state ?? null,
      postalCode: d.postalCode ?? null,
      phone: d.phone ?? null,
      isDefault: d.isDefault ?? false,
    },
  });

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function updateAddressAction(
  addressId: string,
  _prev: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const parsed = AddressSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success)
    return { errors: z.flattenError(parsed.error).fieldErrors };

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id)
    return { message: "Address not found." };

  const d = parsed.data;
  if (d.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }
  await prisma.address.update({
    where: { id: addressId },
    data: {
      ...d,
      label: d.label ?? null,
      line2: d.line2 ?? null,
      state: d.state ?? null,
      postalCode: d.postalCode ?? null,
      phone: d.phone ?? null,
      isDefault: d.isDefault ?? false,
    },
  });

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddressAction(
  addressId: string,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id)
    return { error: "Address not found." };

  await prisma.address.delete({ where: { id: addressId } });
  revalidatePath("/account/addresses");
  return {};
}

export async function setDefaultAddressAction(
  addressId: string,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id)
    return { error: "Address not found." };

  await prisma.address.updateMany({
    where: { userId: session.user.id },
    data: { isDefault: false },
  });
  await prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });
  revalidatePath("/account/addresses");
  return {};
}
