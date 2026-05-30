"use server";

export type ContactState = { success?: boolean; message?: string } | undefined;

export async function sendContactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message)
    return { message: "All fields are required." };

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:
        process.env.EMAIL_FROM ?? "AutoParts Hub <noreply@autopartshub.com>",
      to: "support@autopartshub.com",
      subject: `Contact form: ${name}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });
  } catch {
    /* best-effort */
  }

  return { success: true };
}
