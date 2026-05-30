import { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Policy — AutoParts.Hub" };

export default function ShippingPage() {
  return (
    <div className="container-page py-14 max-w-3xl prose prose-neutral">
      <h1>Shipping Policy</h1>
      <p>
        We partner with reputable couriers to deliver your parts safely and on
        time.
      </p>

      <h2>Processing Time</h2>
      <p>
        Orders are processed within 1–2 business days after payment
        confirmation. Orders placed on weekends or public holidays are processed
        the next business day.
      </p>

      <h2>Delivery Time</h2>
      <ul>
        <li>
          <strong>Addis Ababa:</strong> 1–3 business days
        </li>
        <li>
          <strong>Regional cities:</strong> 3–7 business days
        </li>
        <li>
          <strong>Remote areas:</strong> 7–14 business days
        </li>
      </ul>

      <h2>Shipping Fees</h2>
      <p>
        Shipping is calculated at checkout based on item weight, dimensions, and
        destination. Free shipping is available on orders over ETB 5,000.
      </p>

      <h2>Order Tracking</h2>
      <p>
        You will receive a tracking number by email as soon as your order ships.
        You can also view your tracking number in your account under{" "}
        <em>Orders</em>.
      </p>

      <h2>Damages in Transit</h2>
      <p>
        If your order arrives damaged, contact us within 48 hours with photos.
        We will arrange a replacement or refund at no additional cost.
      </p>
    </div>
  );
}
