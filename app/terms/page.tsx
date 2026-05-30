import { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service — AutoParts.Hub" };

export default function TermsPage() {
  return (
    <div className="container-page py-14 max-w-3xl prose prose-neutral">
      <h1>Terms of Service</h1>
      <p>By using AutoParts.Hub, you agree to these terms.</p>

      <h2>Use of the Platform</h2>
      <p>
        You must be at least 18 years old to create an account. You agree to
        provide accurate information and to keep your account credentials
        secure.
      </p>

      <h2>Purchases</h2>
      <p>
        All purchases are subject to product availability. We reserve the right
        to cancel orders affected by pricing errors or stock issues.
      </p>

      <h2>Seller Responsibilities</h2>
      <p>
        Sellers are responsible for accurate product listings, fulfilling orders
        promptly, and resolving customer disputes in good faith. Violations may
        result in account suspension.
      </p>

      <h2>Prohibited Activities</h2>
      <ul>
        <li>Selling counterfeit or unsafe parts</li>
        <li>Misrepresenting product condition or compatibility</li>
        <li>Circumventing the platform for off-platform transactions</li>
        <li>Fraudulent reviews or manipulation of ratings</li>
      </ul>

      <h2>Limitation of Liability</h2>
      <p>
        AutoParts.Hub acts as a marketplace intermediary. We are not liable for
        losses arising from product defects or installation errors beyond the
        extent required by law.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We may update these terms at any time. Continued use of the platform
        after changes constitutes acceptance.
      </p>
    </div>
  );
}
