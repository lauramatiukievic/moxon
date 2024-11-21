'use client'
import { useState } from 'react';

const banks = [
  { id: 'swedbank', name: 'Swedbank', logo: '🟠', link: 'https://swedbank.com' }, // Replace emoji with actual logos
  { id: 'seb', name: 'SEB', logo: '⬛', link: 'https://seb.com' },
  { id: 'luminor', name: 'Luminor', logo: '⚪', link: 'https://luminor.com' },
  { id: 'revolut', name: 'Revolut', logo: '🟣', link: 'https://revolut.com' },
  { id: 'citadele', name: 'Citadele', logo: '🟥', link: 'https://citadele.com' },
  { id: 'siauliubankas', name: 'Šiaulių bankas', logo: '🔵', link: 'https://sb.lt' },
];

export default function PaymentSelection() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const handleBankSelection = (bankId: string) => {
    setSelectedBank(bankId);
    // Optionally, redirect to the selected bank link:
    // window.location.href = banks.find(bank => bank.id === bankId)?.link;
  };

  const handleSelection = (paymentType: string) => {
    if (selectedPayment === paymentType) {
      setSelectedPayment(null); // Toggle collapse on click
    } else {
      setSelectedPayment(paymentType); // Expand the selected section
    }
  };
  return (
    <div className="w-full mt-10">
      <h2 className="text-lg mb-4 font-medium text-gray-900">Apmokėjimas</h2>

      {/* El. bankininkystė */}
     <div
        className={`border rounded-lg p-4 mb-4 cursor-pointer ${
          selectedPayment === 'elBankininkyste' ? 'bg-gray-100' : ''
        }`}
        onClick={() => handleSelection('elBankininkyste')}
      >
        <div className="flex items-center space-x-4">
          <span className="text-2xl">🏦</span> {/* Icon for El. bankininkystė */}
          <span className="font-medium">El. bankininkystė</span>
        </div>

        {selectedPayment === 'elBankininkyste' && (
          <div className="mt-4">
            {/* Bank Selection Grid */}
            <div className="grid grid-cols-2 gap-4">
              {banks.map((bank) => (
                <div
                  key={bank.id}
                  className={`flex items-center border p-4 rounded-lg cursor-pointer ${
                    selectedBank === bank.id ? 'bg-yellow-400 border-yellow-600' : 'border-gray-300'
                  }`}
                  onClick={() => handleBankSelection(bank.id)}
                >
                  <input
                    type="radio"
                    id={bank.id}
                    name="bank"
                    value={bank.id}
                    checked={selectedBank === bank.id}
                    onChange={() => handleBankSelection(bank.id)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                  />
                  <label htmlFor={bank.id} className="flex items-center ml-3">
                    <img src={bank.logo} alt={bank.name} className="h-6 w-6" /> {/* Bank Logo */}
                    <span className="ml-3 font-medium text-gray-900">{bank.name}</span>
                  </label>
                </div>
              ))}
            </div>

            {selectedBank && (
              <div className="mt-4">
                <a
                  href={banks.find((bank) => bank.id === selectedBank)?.link}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Continue to {banks.find((bank) => bank.id === selectedBank)?.name}
                </a>
              </div>
            )}
            </div>)}
</div>






      {/* Mokėjimo kortelė */}
      <div
        className={`border rounded-lg p-4 mb-4 cursor-pointer ${
          selectedPayment === 'mokejimoKortele' ? 'bg-gray-100' : ''
        }`}
        onClick={() => handleSelection('mokejimoKortele')}
      >
        <div className="flex items-center space-x-4">
          <span className="text-2xl">💳</span> {/* Icon for Mokėjimo kortelė */}
          <span className="font-medium">Mokėjimo kortelė</span>
        </div>
        {selectedPayment === 'mokejimoKortele' && (
          <div className="mt-4">
            {/* Expand Credit Card Details */}
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-4">
                <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                  Kortelės numeris
                </label>
                <input
                  type="text"
                  id="card-number"
                  name="card-number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Kortelės numeris"
                />
              </div>

              <div className="col-span-4">
                <label htmlFor="bank-name" className="block text-sm font-medium text-gray-700">
                  Banko pavadinimas
                </label>
                <input
                  type="text"
                  id="bank-name"
                  name="bank-name"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Banko pavadinimas"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                    Galiojimo data (MM/YY)
                  </label>
                  <input
                    type="text"
                    id="expiration-date"
                    name="expiration-date"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="MM/YY"
                  />
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="CVC"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
