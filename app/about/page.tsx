import { Metadata } from "next";

export const metadata: Metadata = { title: "About Us — AutoParts.Hub" };

export default function AboutPage() {
  return (
    <div className="container-page py-14 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight">About AutoParts.Hub</h1>
      <p className="mt-4 text-lg text-foreground-muted">
        AutoParts.Hub is Ethiopia&apos;s premier online marketplace for genuine
        OEM and premium aftermarket automotive parts. We connect car owners with
        trusted sellers across the country, making it easy to find the right
        part at the right price.
      </p>

      <h2 className="mt-10 text-2xl font-bold">Our Mission</h2>
      <p className="mt-3 text-foreground-muted">
        To simplify the way people find and buy car parts — bringing
        transparency, reliability, and convenience to every repair.
      </p>

      <h2 className="mt-10 text-2xl font-bold">Why AutoParts.Hub?</h2>
      <ul className="mt-4 space-y-3 text-foreground-muted">
        <li className="flex gap-3">
          <span className="font-bold text-accent-600">✓</span> Verified sellers
          with quality guarantees
        </li>
        <li className="flex gap-3">
          <span className="font-bold text-accent-600">✓</span> Vehicle-specific
          compatibility search
        </li>
        <li className="flex gap-3">
          <span className="font-bold text-accent-600">✓</span> Secure payments
          via Chapa
        </li>
        <li className="flex gap-3">
          <span className="font-bold text-accent-600">✓</span> Fast nationwide
          delivery
        </li>
        <li className="flex gap-3">
          <span className="font-bold text-accent-600">✓</span> 30-day
          hassle-free returns
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-bold">Become a Seller</h2>
      <p className="mt-3 text-foreground-muted">
        Do you sell auto parts? Join our growing network of verified sellers and
        reach thousands of customers across Ethiopia.
      </p>
      <a
        href="/seller/onboarding"
        className="mt-4 inline-flex h-10 items-center rounded-lg bg-accent-600 px-5 text-sm font-medium text-white hover:bg-accent-700"
      >
        Apply now
      </a>
    </div>
  );
}
