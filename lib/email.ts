import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.EMAIL_FROM ?? "AutoParts Hub <noreply@autopartshub.com>";

export async function sendOrderConfirmationEmail(opts: {
  to: string;
  name: string;
  orderNumber: string;
  total: string;
  items: { name: string; qty: number; price: string }[];
}) {
  const itemsHtml = opts.items
    .map(
      (i) =>
        `<tr><td style="padding:4px 8px">${i.name}</td><td style="padding:4px 8px">${i.qty}</td><td style="padding:4px 8px">${i.price}</td></tr>`,
    )
    .join("");

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `Order Confirmed — #${opts.orderNumber}`,
    html: `
      <h2>Thanks for your order, ${opts.name}!</h2>
      <p>Your order <strong>#${opts.orderNumber}</strong> has been received.</p>
      <table border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:480px">
        <thead><tr><th style="padding:4px 8px">Item</th><th>Qty</th><th>Price</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p><strong>Order total: ${opts.total}</strong></p>
      <p>We'll notify you when your order ships.</p>
    `,
  });
}

export async function sendShippingUpdateEmail(opts: {
  to: string;
  name: string;
  orderNumber: string;
  trackingNumber: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `Your order #${opts.orderNumber} has shipped!`,
    html: `
      <h2>Great news, ${opts.name}!</h2>
      <p>Order <strong>#${opts.orderNumber}</strong> has been shipped.</p>
      <p>Tracking number: <strong>${opts.trackingNumber}</strong></p>
    `,
  });
}

export async function sendPasswordResetEmail(opts: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "Reset your AutoParts Hub password",
    html: `
      <h2>Hi ${opts.name},</h2>
      <p>We received a request to reset your password.</p>
      <p><a href="${opts.resetUrl}" style="display:inline-block;padding:10px 20px;background:#E63946;color:#fff;border-radius:6px;text-decoration:none">Reset password</a></p>
      <p>This link expires in 1 hour. If you didn't request a reset, ignore this email.</p>
    `,
  });
}

export async function sendSellerApprovalEmail(opts: {
  to: string;
  name: string;
  storeName: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "Your seller account has been approved!",
    html: `
      <h2>Congratulations, ${opts.name}!</h2>
      <p>Your store <strong>${opts.storeName}</strong> has been approved on AutoParts Hub.</p>
      <p>You can now start listing products and accepting orders.</p>
      <p><a href="${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/seller">Go to seller dashboard</a></p>
    `,
  });
}
