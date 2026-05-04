import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function updateStore(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const seller = await prisma.seller.findUnique({
    where: { userId: session.user.id },
  });
  if (!seller) redirect("/seller/onboarding");

  await prisma.seller.update({
    where: { id: seller.id },
    data: {
      storeName: String(formData.get("storeName") ?? seller.storeName),
      description: String(formData.get("description") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? "") || null,
      contactPhone: String(formData.get("contactPhone") ?? "") || null,
    },
  });
  revalidatePath("/seller/store");
}

export const metadata = { title: "Store settings · Seller" };

export default async function SellerStorePage() {
  const session = await auth();
  const seller = await prisma.seller.findUnique({
    where: { userId: session!.user.id },
  });
  if (!seller) redirect("/seller/onboarding");

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Store settings</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Update your storefront information.
      </p>

      <form action={updateStore} className="mt-6 max-w-xl space-y-4 rounded-2xl border border-border bg-surface p-6">
        <div>
          <label className="text-sm font-medium" htmlFor="storeName">Store name</label>
          <input id="storeName" name="storeName" defaultValue={seller.storeName} required
            className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm focus-ring" />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} defaultValue={seller.description ?? ""}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm focus-ring" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium" htmlFor="contactEmail">Contact email</label>
            <input id="contactEmail" name="contactEmail" type="email" defaultValue={seller.contactEmail ?? ""}
              className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm focus-ring" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="contactPhone">Contact phone</label>
            <input id="contactPhone" name="contactPhone" type="tel" defaultValue={seller.contactPhone ?? ""}
              className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm focus-ring" />
          </div>
        </div>
        <button type="submit"
          className="h-11 rounded-lg bg-accent-600 px-6 font-medium text-white hover:bg-accent-700 transition-colors">
          Save changes
        </button>
      </form>
    </>
  );
}
