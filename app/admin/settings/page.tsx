import { prisma } from "@/lib/prisma";

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

      <div className="mt-6 rounded-xl border border-border bg-surface">
        {settings.length === 0 ? (
          <p className="p-10 text-center text-foreground-muted">
            No settings configured yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {settings.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between px-5 py-4 text-sm"
              >
                <div>
                  <p className="font-medium">{s.key}</p>
                  {s.description && (
                    <p className="text-xs text-foreground-muted">
                      {s.description}
                    </p>
                  )}
                </div>
                <code className="rounded bg-surface-muted px-2 py-1 text-xs">
                  {s.value}
                </code>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
