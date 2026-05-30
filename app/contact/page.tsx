"use client";

import { useActionState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { sendContactAction, ContactState } from "@/actions/contact";

export default function ContactPage() {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendContactAction,
    undefined,
  );

  return (
    <div className="container-page py-14">
      <div className="grid gap-12 lg:grid-cols-2 max-w-4xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="mt-3 text-foreground-muted">
            Have a question? We&apos;re here to help.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { Icon: Mail, label: "Email", value: "support@autopartshub.com" },
              { Icon: Phone, label: "Phone", value: "+251 911 000 000" },
              {
                Icon: MapPin,
                label: "Address",
                value: "Bole, Addis Ababa, Ethiopia",
              },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface border border-border">
                  <Icon className="h-4 w-4 text-accent-600" />
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          {state?.success ? (
            <div className="grid place-items-center py-12 text-center">
              <p className="text-2xl">✓</p>
              <p className="mt-2 font-semibold">Message sent!</p>
              <p className="mt-1 text-sm text-foreground-muted">
                We&apos;ll get back to you within 1 business day.
              </p>
            </div>
          ) : (
            <form action={action} className="space-y-4">
              {state?.message && (
                <p className="text-sm text-red-600">{state.message}</p>
              )}
              {[
                { name: "name", label: "Name", type: "text" },
                { name: "email", label: "Email", type: "email" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium">{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type}
                    required
                    className="mt-1 w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="mt-1 w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
                />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-accent-600 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-50"
              >
                {pending ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
