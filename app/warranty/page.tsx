import { Metadata } from "next";

export const metadata: Metadata = { title: "Warranty Policy — AutoParts.Hub" };

export default function WarrantyPage() {
  return (
    <div className="container-page py-14 max-w-3xl prose prose-neutral">
      <h1>Warranty Policy</h1>
      <p>
        AutoParts.Hub stands behind the quality of every part sold on our
        platform.
      </p>

      <h2>Manufacturer Warranty</h2>
      <p>
        All new OEM and most aftermarket parts come with a manufacturer
        warranty. Warranty terms vary by brand and are listed on each product
        page.
      </p>

      <h2>AutoParts.Hub Guarantee</h2>
      <p>
        In addition to manufacturer warranties, we offer a{" "}
        <strong>90-day fitment guarantee</strong>. If a part doesn&apos;t fit
        your vehicle as described, we&apos;ll replace it or issue a full refund.
      </p>

      <h2>What Is Not Covered</h2>
      <ul>
        <li>Normal wear and tear</li>
        <li>Damage from improper installation</li>
        <li>Modification or tampering</li>
        <li>Corrosion from exposure to incompatible fluids</li>
      </ul>

      <h2>Claiming Warranty</h2>
      <p>
        Contact us within the warranty period with your order number and a
        description of the issue. Our team will assess the claim and respond
        within 2 business days.
      </p>
    </div>
  );
}
