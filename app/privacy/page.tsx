import { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — AutoParts.Hub" };

export default function PrivacyPage() {
  return (
    <div className="container-page py-14 max-w-3xl prose prose-neutral">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().getFullYear()}</p>

      <h2>Information We Collect</h2>
      <p>
        We collect information you provide when creating an account, placing
        orders, or contacting support — including name, email, address, and
        payment details (processed securely by Chapa).
      </p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and fulfill orders</li>
        <li>To send order and shipping notifications</li>
        <li>To improve our platform and personalize your experience</li>
        <li>To prevent fraud and ensure platform security</li>
      </ul>

      <h2>Data Sharing</h2>
      <p>
        We do not sell your personal data. We share limited data with payment
        processors, couriers, and sellers only as necessary to complete your
        order.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may access, correct, or delete your account data at any time from
        your account settings. To submit a data request, contact us at
        privacy@autopartshub.com.
      </p>

      <h2>Cookies</h2>
      <p>
        We use essential cookies for authentication and session management. No
        third-party tracking cookies are used without your consent.
      </p>
    </div>
  );
}
