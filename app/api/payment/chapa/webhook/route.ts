import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Chapa webhook handler.
 * Verifies the CHAPA-SIGNATURE header then updates the order payment status.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const signature = req.headers.get("chapa-signature") ?? "";
  const secret = process.env.CHAPA_WEBHOOK_SECRET ?? "";

  if (secret) {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    if (signature !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const txRef = body["tx_ref"] as string | undefined;
  const status = body["status"] as string | undefined;

  if (!txRef || status !== "success") {
    return NextResponse.json({ received: true });
  }

  const order = await prisma.order.findFirst({
    where: { paymentIntentId: txRef },
  });

  if (order && order.paymentStatus === "UNPAID") {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        status: "PROCESSING",
      },
    });
  }

  return NextResponse.json({ received: true });
}
