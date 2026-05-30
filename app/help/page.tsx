import { Metadata } from "next";

export const metadata: Metadata = { title: "Help Center — AutoParts.Hub" };

const faqs = [
  {
    q: "How do I find the right part for my vehicle?",
    a: "Use the vehicle search on our homepage. Select your make, model, and year to filter parts that are confirmed compatible with your car.",
  },
  {
    q: "Are the parts genuine OEM?",
    a: "Each product page lists whether the part is OEM, Aftermarket, or Refurbished. Look for the 'OEM' badge for original manufacturer parts.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships, the tracking number appears in your account under Orders. You'll also receive a shipping email.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept payments via Chapa, which supports Telebirr, CBE Birr, credit/debit cards, and mobile banking.",
  },
  {
    q: "Can I return a part?",
    a: "Yes. We offer a 30-day return policy for unused parts in original packaging. See our Returns page for details.",
  },
  {
    q: "How do I become a seller?",
    a: "Go to the Seller Onboarding page, fill in your store details, and submit for review. Approvals typically take 1-2 business days.",
  },
];

export default function HelpPage() {
  return (
    <div className="container-page py-14 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight">Help Center</h1>
      <p className="mt-3 text-foreground-muted">
        Find answers to the most common questions.
      </p>

      <div className="mt-10 space-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h2 className="font-semibold">{faq.q}</h2>
            <p className="mt-2 text-sm text-foreground-muted">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-border bg-surface-muted p-8 text-center">
        <p className="font-semibold">Still need help?</p>
        <p className="mt-1 text-sm text-foreground-muted">
          Our support team is here for you.
        </p>
        <a
          href="/contact"
          className="mt-4 inline-flex h-10 items-center rounded-lg bg-accent-600 px-5 text-sm font-medium text-white hover:bg-accent-700"
        >
          Contact support
        </a>
      </div>
    </div>
  );
}
