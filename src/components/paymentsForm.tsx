'use client';

import { useEffect, useState } from 'react';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { useShoppingBag } from './shoppingBagContext';
import { print } from 'graphql';
import { RadioGroup, Radio } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CREATE_ORDER_MUTATION } from '@/queries/order/CreateOrder';
import { useSession } from 'next-auth/react';
import Select, { SingleValue } from 'react-select';
import countries from 'world-countries';
import i18nIsoCountries from 'i18n-iso-countries';
import { redirectToPaysera } from '@/utils/checkout-utils';


const deliveryMethods = [
  { id: 1, title: 'Paštomatu', turnaround: '2–5 darbo dienos', price: 3.99 },
  { id: 2, title: 'Į namus', turnaround: '2–5 darbo dienos', price: 4.50 },
];

export default function PaymentForm() {
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { shoppingBag, removeFromBag, clearBag } = useShoppingBag();
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0]);


  i18nIsoCountries.registerLocale(require('i18n-iso-countries/langs/lt.json'));

  const countryOptions = countries.map((country) => ({
    value: country.cca2,
    label: i18nIsoCountries.getName(country.cca2, 'lt') || country.name.common,
  }));


  const handleCountryChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    setBillingDetails({
      ...billingDetails,
      country: selectedOption?.value || '',
    });
  };



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

  useEffect(() => {
    const totalPrice = calculateTotalPrice();
    console.log(`Total Price: €${totalPrice}`);
  }, [selectedDeliveryMethod, shoppingBag]);

  const calculateTotalPrice = () => {
    const productTotal = shoppingBag.reduce(
      (total, product) => total + (parseFloat(product.price ?? '0') * product.quantity),
      0
    );

    const deliveryFee = selectedDeliveryMethod?.price || 0;

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
    setIsSubmitting(true);

    const lineItems = shoppingBag.map((item) => ({
      productId: item.databaseId,
      quantity: item.quantity,
      variationId: item.variationId || null
    }));

    const orderData = {
      paymentMethod: "paysera",
      paymentMethodTitle: "Paysera",
      isPaid: false,
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

    try {
      const response = await fetchGraphQL(print(CREATE_ORDER_MUTATION), { input: orderData }, session);

      clearBag()
      const paymentData = {
        projectid: process.env.NEXT_PUBLIC_PAYSERA_PROJECT_ID!,
        orderid: response.createOrder.order.id,
        accepturl: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success`,
        cancelurl: `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed`,
        callbackurl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paysera-callback`,
        test: "1",
        version: "1.8",
        amount: (calculateTotalPrice() * 100).toFixed(2),
        currency: "EUR",
        p_firstname: billingDetails.firstName,
        p_lastname: billingDetails.lastName,
        p_email: billingDetails.email,
        p_phone: billingDetails.phone,
        p_address: billingDetails.address1,
        p_city: billingDetails.city,
        p_zip: billingDetails.postcode,
        p_country: billingDetails.country
      };
      redirectToPaysera(paymentData);
    } catch (error) {
      console.error('GraphQL Error:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Apmokėjimas</h1>

          <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">Pirkėjo informacija</h2>

                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Elektroninis paštas
                  </label>
                  <div className="mt-1">
                    <input
                      required
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={billingDetails.email}
                      onChange={handleBillingChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    />
                    {!billingDetails.email && (
                      <p className="mt-2 text-sm text-red-600">Reikia užpildyti</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Pristatymo informacija</h2>
                <span>(Pristatysime į artimiausia paštomatą nurodytu adresu)</span>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      Vardas
                    </label>

                    <div className="mt-1">
                      <input
                        required
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={billingDetails.firstName}
                        onChange={handleBillingChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      />
                      {!billingDetails.firstName && (
                        <p className="mt-2 text-sm text-red-600">Reikia užpildyti</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-1">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Pavardė
                    </label>
                    <input
                      required
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={billingDetails.lastName}
                      onChange={handleBillingChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    />
                    {!billingDetails.lastName && (
                      <p className="mt-2 text-sm text-red-600">Reikia užpildyti</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
                      Adresas
                    </label>
                    <input
                      required
                      id="address1"
                      name="address1"
                      type="text"
                      autoComplete="street-address"
                      value={billingDetails.address1}
                      onChange={handleBillingChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    />
                    {!billingDetails.address1 && (
                      <p className="mt-2 text-sm text-red-600">Reikia užpildyti</p>
                    )}
                  </div>


                  <div className="mt-1">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      Miestas
                    </label>
                    <input
                      required
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      value={billingDetails.city}
                      onChange={handleBillingChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    />
                    {!billingDetails.city && (
                      <p className="mt-2 text-sm text-red-600">Reikia užpildyti</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Šalis
                    </label>
                    <div className="mt-1">
                      <Select
                        id="country"
                        options={countryOptions}
                        onChange={handleCountryChange}
                        value={countryOptions.find(option => option.value === billingDetails.country)}
                        placeholder="Pasirinkite šalį"
                        className="w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                      Pašto kodas
                    </label>
                    <input
                      required
                      id="postcode"
                      name="postcode"
                      type="text"
                      autoComplete="postal-code"
                      value={billingDetails.postcode}
                      onChange={handleBillingChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    />
                    {!billingDetails.postcode && (
                      <p className="mt-2 text-sm text-red-600">Reikia užpildyti</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefono numeris
                    </label>
                    <input
                      required
                      id="phone"
                      name="phone"
                      type="text"
                      autoComplete="tel"
                      value={billingDetails.phone}
                      onChange={handleBillingChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    />
                    {!billingDetails.phone && (
                      <p className="mt-2 text-sm text-red-600">Reikia užpildyti</p>
                    )}
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
                        className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-purple-500"
                      >
                        <span className="flex flex-1">
                          <span className="flex flex-col">
                            <span className="block text-sm font-medium text-gray-900">{deliveryMethod.title}</span>
                            <span className="mt-1 flex items-center text-sm text-gray-500">
                              {deliveryMethod.turnaround}
                            </span>
                            <span className="mt-6 text-sm font-medium text-gray-900">{deliveryMethod.price} €</span>
                          </span>
                        </span>
                        <CheckCircleIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-purple-600 [.group:not([data-checked])_&]:hidden"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-purple-500"
                        />
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div>

              {/* Payment */}

            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">Užsakymo informacija</h2>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <h3 className="sr-only">Produktai krepšelyje</h3>
                <ul role="list" className="divide-y divide-gray-200">
                  {shoppingBag.map((product, index) => (
                    <li key={'' + product.savedVariation + product.selectedColor} className="flex px-4 py-6 sm:px-6">
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
                              onClick={() => removeFromBag(product.id, product.selectedSize || null, product.selectedColor || null)}
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
                    <dd className="text-sm font-medium text-gray-900">                     {shoppingBag
                      .reduce((total, product) => total + parseFloat(product.price ?? '0') * product.quantity, 0)
                      .toFixed(2)}{' '}
                      € </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm  text-gray-900">Pristatymo mokestis</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {selectedDeliveryMethod.price.toFixed(2)} €
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium  text-gray-900">Viso</dt>
                    <dd className="text-base font-medium text-gray-900">   {calculateTotalPrice().toFixed(2)} €  </dd>
                  </div>
                </dl>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <button
                    type="submit"
                    className={`w-full rounded-md border border-transparent bg-purple-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    disabled={isSubmitting}

                  >
                    {isSubmitting ? 'Užsakymas tvirtinamas...' : 'Patvirtinti užsakymą'}
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

