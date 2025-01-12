
import PaymentForm from "@/components/paymentsForm";

export default function PaymentPage() {

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <h1 className="sr-only">Payment Page</h1>
        <PaymentForm />
      </main>
    </div>
  );
}
