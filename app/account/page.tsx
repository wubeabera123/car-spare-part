import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AvatarUpload } from "@/components/account/avatar-upload";
import { ProfileForm } from "@/components/account/profile-form";

export const metadata = { title: "Profile" };

export default async function AccountPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
      role: true,
    },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Manage your account details and profile picture.
      </p>

      {/* Avatar + info card */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          {/* Avatar upload */}
          <AvatarUpload
            currentImage={user?.image ?? null}
            userName={user?.name ?? null}
          />

          {/* Quick info */}
          <dl className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
            {[
              ["Name", user?.name ?? "—"],
              ["Email", user?.email],
              ["Phone", user?.phone ?? "Not set"],
              [
                "Member since",
                user?.createdAt?.toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              ],
              ["Role", user?.role],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wider text-foreground-muted">
                  {k}
                </dt>
                <dd className="mt-1 text-sm font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Edit profile form */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold mb-5">Edit Profile</h2>
        <ProfileForm
          initialName={user?.name ?? ""}
          initialPhone={user?.phone ?? ""}
          initialEmail={user?.email ?? ""}
        />
      </div>
    </>
  );
}
