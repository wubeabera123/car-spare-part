import { prisma } from "@/lib/prisma";
import { UpsertSettingForm } from "@/components/admin/upsert-setting-form";

export const metadata = { title: "Settings · Admin" };

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Site settings</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Global configuration values.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-border bg-surface">
          {settings.length === 0 ? (
            <p className="p-10 text-center text-foreground-muted">
              No settings configured yet. Add one using the form.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {settings.map((s) => (
                <li
                  key={s.key}
                  className="flex items-center justify-between px-5 py-4 text-sm"
                >
                  <p className="font-medium">{s.key}</p>
                  <code className="rounded bg-surface-muted px-2 py-1 text-xs">
                    {JSON.stringify(s.value)}
                  </code>
                </li>
              ))}
            </ul>
          )}
        </div>

        <UpsertSettingForm />
      </div>
    </>
  );
}
