/**
 * Chapa payment gateway helpers.
 * Docs: https://developer.chapa.co/docs
 */

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY ?? "";
const CHAPA_BASE = "https://api.chapa.co/v1";

export interface ChapaInitPayload {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name?: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization?: { title?: string; description?: string };
}

export interface ChapaInitResponse {
  message: string;
  status: string;
  data: { checkout_url: string };
}

export interface ChapaVerifyResponse {
  message: string;
  status: string;
  data: {
    status: string;
    amount: number;
    currency: string;
    tx_ref: string;
    reference?: string;
  };
}

export async function initializeChapaPayment(
  payload: ChapaInitPayload,
): Promise<ChapaInitResponse> {
  const res = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Chapa init failed: ${err}`);
  }

  return res.json() as Promise<ChapaInitResponse>;
}

export async function verifyChapaPayment(
  txRef: string,
): Promise<ChapaVerifyResponse> {
  const res = await fetch(`${CHAPA_BASE}/transaction/verify/${txRef}`, {
    headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Chapa verify failed: ${err}`);
  }

  return res.json() as Promise<ChapaVerifyResponse>;
}
