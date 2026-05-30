import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds — AutoParts.Hub",
};

export default function ReturnsPage() {
  return (
    <div className="container-page py-14 max-w-3xl prose prose-neutral">
      <h1>Returns &amp; Refunds</h1>
      <p>
        We want you to be 100% satisfied with your purchase. If something
        isn&apos;t right, we&apos;re here to help.
      </p>

      <h2>Return Window</h2>
      <p>
        You may return most items within <strong>30 days</strong> of delivery,
        provided the part is unused, uninstalled, and in original packaging.
      </p>

      <h2>Non-Returnable Items</h2>
      <ul>
        <li>Electrical parts that have been installed</li>
        <li>Fluids, oils, and chemicals (opened)</li>
        <li>Custom-cut or special-order parts</li>
        <li>Items marked &quot;Final Sale&quot;</li>
      </ul>

      <h2>How to Return</h2>
      <ol>
        <li>
          Go to <em>Account → Orders</em> and click &quot;Request Return&quot;
          on the eligible order.
        </li>
        <li>Select the item(s) and reason for return.</li>
        <li>We&apos;ll email you a return label within 1 business day.</li>
        <li>Drop off the package at the designated courier point.</li>
      </ol>

      <h2>Refunds</h2>
      <p>
        Once we receive and inspect the item, refunds are processed within 3–5
        business days back to your original payment method.
      </p>
    </div>
  );
}
