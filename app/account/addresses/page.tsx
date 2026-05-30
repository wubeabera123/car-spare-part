import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";
import {
  AddressActions,
  NewAddressForm,
} from "@/components/account/address-actions";

export const metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Addresses</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Manage shipping and billing addresses.
          </p>
        </div>
        <NewAddressForm />
      </div>

      {addresses.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-2xl border border-dashed border-border bg-surface-muted p-12 text-center">
          <MapPin className="h-9 w-9 text-foreground-muted" />
          <p className="mt-3 font-semibold">No saved addresses</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {a.label && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                      {a.label}
                    </p>
                  )}
                  <p className="font-semibold">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-foreground-muted">
                    {a.city}
                    {a.state ? `, ${a.state}` : ""} {a.postalCode}
                    <br />
                    {a.country}
                    {a.phone ? (
                      <>
                        <br />
                        {a.phone}
                      </>
                    ) : null}
                  </p>
                </div>
                {a.isDefault && (
                  <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                    Default
                  </span>
                )}
              </div>
              <AddressActions address={a} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
