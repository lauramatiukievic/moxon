'use client';

import { useState } from 'react';
import { CREATE_ORDER_MUTATION } from '@/queries/order/OrderQuery';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { useShoppingBag } from './shoppingBagContext';
import { print } from 'graphql';
import { RadioGroup, Radio } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import PaymentSelection from './paymentsSection';


const deliveryMethods = [
    { id: 1, title: 'Standard', turnaround: '4–10 business days', price: 5.00 },
    { id: 2, title: 'Express', turnaround: '2–5 business days', price: 16.00 },
  ];
const paymentMethods = [
  { id: 'credit-card', title: 'Credit card' },
  { id: 'paypal', title: 'PayPal' },
  { id: 'etransfer', title: 'eTransfer' },
]


export default  function PaymentForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0])
    const { shoppingBag, removeFromBag } = useShoppingBag(); 
//   const { shoppingBag } = useShoppingBag();
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    city: '',
    postcode: '',
    country: '',
    phone: '',
  });

  const calculateTotalPrice = () => {
    const productTotal = shoppingBag.reduce(
      (total, product) => total + (parseFloat(product.price ?? '0') * product.quantity),
      0
    );
    const deliveryFee = 5; // Always set to 5€
    return productTotal + deliveryFee;
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingDetails({
      ...billingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const lineItems = shoppingBag.map((item) => ({
        productId: parseInt(atob(item.id).split(':')[1], 10), // Decode base64 and extract the integer
        quantity: item.quantity,
      }));
  
    const orderData = {
        paymentMethod: "cod",
        paymentMethodTitle: "Cash on Delivery",
        isPaid: true,
        billing: {
          firstName: billingDetails.firstName,
          lastName: billingDetails.lastName,
          email: billingDetails.email,
          address1: billingDetails.address1,
          city: billingDetails.city,
          postcode: billingDetails.postcode,
          country: billingDetails.country,
          phone: billingDetails.phone,
        },
        shipping: {
          firstName: billingDetails.firstName,
          lastName: billingDetails.lastName,
          address1: billingDetails.address1,
          city: billingDetails.city,
          postcode: billingDetails.postcode,
          country: billingDetails.country,
        },
        lineItems,
      };
      
  
      console.log("Order Data Sent to GraphQL:", orderData); // Log the order data before sending
  
    try {
      const response = await fetchGraphQL(print(CREATE_ORDER_MUTATION), { input: orderData });
      console.log("GraphQL Response:", response);
  
      // Handle success
      alert("Order successfully created!");
    } catch (error) {
      console.error("GraphQL Error:", error); // Log the GraphQL error
      alert("Failed to create order. Please try again.");
    }
  };
  
  

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Apmokėjimas</h1>

          <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">Pirkėjo informacija</h2>

                <div className="mt-4">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                   Elektroninis paštas
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={billingDetails.email}
                      onChange={handleBillingChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Pristatymo informacija</h2>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                     Vardas
                    </label>
                    <div className="mt-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="firstName"
                        value={billingDetails.firstName}
                        onChange={handleBillingChange}
                        className="block w-full text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Pavardė
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={billingDetails.lastName}
                        onChange={handleBillingChange}
                        className="block w-full text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Adresas (Gatvė, namo numeris, buto numeris)
                    </label>
                    <div className="mt-1">
                      <input
                        id="address1"
                        name="address1"
                        type="text"
                        autoComplete="street-address"
                        value={billingDetails.address1}
                        onChange={handleBillingChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>


                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      Miestas
                    </label>
                    <div className="mt-1">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        value={billingDetails.city}
                        onChange={handleBillingChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Šalis
                    </label>
                    <div className="mt-1">
                    <input
                        id="country"
                        name="country"
                        type="text"
                        autoComplete="address-level2"
                        value={billingDetails.country}
                        onChange={handleBillingChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                      Pašto kodas
                    </label>
                    <div className="mt-1">
                      <input
                        id="postcode"
                        name="postcode"
                        type="text"
                        autoComplete="postal-code"
                        value={billingDetails.postcode}
                        onChange={handleBillingChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefono numeris
                    </label>
                    <div className="mt-1">
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        autoComplete="tel"
                        value={billingDetails.phone}
                        onChange={handleBillingChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Pristatymo metodai:</h2>

                <fieldset aria-label="Delivery method" className="mt-4">
                  <RadioGroup
                    value={selectedDeliveryMethod}
                    onChange={setSelectedDeliveryMethod}
                    className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
                  >
                    {deliveryMethods.map((deliveryMethod) => (
                      <Radio
                        key={deliveryMethod.id}
                        value={deliveryMethod}
                        aria-label={deliveryMethod.title}
                        aria-description={`${deliveryMethod.turnaround} for ${deliveryMethod.price}`}
                        className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-indigo-500"
                      >
                        <span className="flex flex-1">
                          <span className="flex flex-col">
                            <span className="block text-sm font-medium text-gray-900">{deliveryMethod.title}</span>
                            <span className="mt-1 flex items-center text-sm text-gray-500">
                              {deliveryMethod.turnaround}
                            </span>
                            <span className="mt-6 text-sm font-medium text-gray-900">{deliveryMethod.price} </span>
                          </span>
                        </span>
                        <CheckCircleIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-indigo-600 [.group:not([data-checked])_&]:hidden"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
                        />
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div>

              {/* Payment */}
              <PaymentSelection/>
              {/* <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Apmokėjimas</h2>

                <fieldset className="mt-4">
                  <legend className="sr-only">Pasirinkite apmokėjimą</legend>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                    {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                      <div key={paymentMethod.id} className="flex items-center">
                        {paymentMethodIdx === 0 ? (
                          <input
                            defaultChecked
                            id={paymentMethod.id}
                            name="payment-type"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        ) : (
                          <input
                            id={paymentMethod.id}
                            name="payment-type"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        )}

                        <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
                          {paymentMethod.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                  <div className="col-span-4">
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                      Kortelės numeris
                    </label>
                    <div className="mt-1">
                      <input
                        id="card-number"
                        name="card-number"
                        type="text"
                        autoComplete="cc-number"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                      Banko pavadinimas
                    </label>
                    <div className="mt-1">
                      <input
                        id="name-on-card"
                        name="name-on-card"
                        type="text"
                        autoComplete="cc-name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-span-3">
                    <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                      Galiojimo data (MM/YY)
                    </label>
                    <div className="mt-1">
                      <input
                        id="expiration-date"
                        name="expiration-date"
                        type="text"
                        autoComplete="cc-exp"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <div className="mt-1">
                      <input
                        id="cvc"
                        name="cvc"
                        type="text"
                        autoComplete="csc"
                        className="block w-full rounded-md text-gray-900 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">Užsakymo informacija</h2>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <h3 className="sr-only">Produktai krepšelyje</h3>
                <ul role="list" className="divide-y divide-gray-200">
                  {shoppingBag.map((product, index ) => (
                    <li key={`${product.id}-${index}`} className="flex px-4 py-6 sm:px-6">
                      <div className="flex-shrink-0">
                        <img alt={product.image?.altText!} src={product.image?.sourceUrl!} className="w-20 rounded-md" />
                      </div>

                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm">
                              <a href='/product' className="font-medium text-gray-700 hover:text-gray-800">
                                {product.name}
                              </a>
                            </h4>
                            {/* <p className="mt-1 text-sm text-gray-500">{product.size}</p> */}
                          </div>

                          <div className="ml-4 flow-root flex-shrink-0">
                            <button
                             onClick={() => removeFromBag(product.id, product.selectedSize)}
                              type="button"
                              className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <TrashIcon aria-hidden="true" className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-1 items-end justify-between pt-2">
                          <p className="mt-1 text-sm font-medium text-gray-500">  {product.quantity ?? 1} vnt. ~    {product.price} €</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">  {(parseFloat(product.price ?? "0") * product.quantity).toFixed(2)} €</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm  text-gray-900">Produktai</dt>
                    <dd className="text-sm font-medium text-gray-900">                      {shoppingBag
                      .reduce((total, product) => total + parseFloat(product.price!.replace('$', '')), 0)
                      .toFixed(2)}{' '}
                    € </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm  text-gray-900">Pristatymo mokestis</dt>
                    <dd className="text-sm font-medium text-gray-900">5.00  € </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium  text-gray-900">Viso</dt>
                    <dd className="text-base font-medium text-gray-900">   {calculateTotalPrice().toFixed(2)} €  </dd>
                  </div>
                </dl>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
  <button
    type="submit"
    className={`w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
    }`}
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
  </button>
</div>
              </div>
            </div>




          </form>
        </div>
      </main>

    </div>
  );
}
