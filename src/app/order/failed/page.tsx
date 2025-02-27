import { XCircleIcon } from "@heroicons/react/24/outline";

function FailedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 p-8">
      <div className="bg-white shadow-2xl rounded-xl p-12 text-center max-w-lg">
        <XCircleIcon className="h-20 w-20 text-red-600 mb-6" />
        <h1 className="text-3xl font-extrabold text-gray-900">Užsakymas nepavyko</h1>
        <p className="text-lg text-gray-700 mt-4">Įvyko klaida. Bandykite dar kartą.</p>
        <a href="/" className="mt-6 inline-block bg-red-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg hover:bg-red-600">Grįžti į pradžią</a>
      </div>
    </div>
  );
}
  export default FailedPage