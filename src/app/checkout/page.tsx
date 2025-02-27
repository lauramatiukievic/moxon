
import PaymentForm from "@/components/paymentsForm";
import { auth } from "@/auth"
import { redirect } from "next/navigation";

export default async function PaymentPage() {
  const session = await auth()
  if (!session) redirect('/signIn')


  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <h1 className="sr-only">Payment Page</h1>
        <PaymentForm />
      </main>
    </div>
  );
}
