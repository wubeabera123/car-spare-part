import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function becomeSeller(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const storeName = String(formData.get("storeName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!storeName) return;

  const slug = storeName.toLowerCase().replace(/\W+/g, "-");
  await prisma.seller.create({
    data: {
      userId: session.user.id,
      storeName,
      storeSlug: slug,
      description,
      status: "PENDING",
    },
  });
  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: "SELLER" },
  });
  revalidatePath("/seller");
  redirect("/seller");
}

export const metadata = { title: "Become a seller" };

export default async function SellerOnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/seller/onboarding");

  const existing = await prisma.seller.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) redirect("/seller");

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <h1 className="text-2xl font-bold tracking-tight">Become a seller</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Set up your store and start listing parts in minutes.
        </p>

        <form action={becomeSeller} className="mt-6 space-y-4">
          <div>
            <label htmlFor="storeName" className="text-sm font-medium">Store name</label>
            <input
              id="storeName" name="storeName" required
              className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm focus-ring"
            />
          </div>
          <div>
            <label htmlFor="description" className="text-sm font-medium">Store description</label>
            <textarea
              id="description" name="description" rows={4}
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm focus-ring"
            />
          </div>
          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-accent-600 font-medium text-white hover:bg-accent-700 transition-colors"
          >
            Submit application
          </button>
          <p className="text-xs text-foreground-muted">
            Your application will be reviewed within 24-48 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
