'use client'
import { BagItem, useShoppingBag } from "@/components/shoppingBagContext";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ShoppingBag() {
  const { shoppingBag, removeFromBag, addToBag, updateQuantity } = useShoppingBag();

  const handleDecreaseQuantity = (product: BagItem) => {
    if (product.quantity > 1) {
      updateQuantity(product.id, product.quantity - 1, product.selectedSize);
    } else {
      removeFromBag(product.id, product.selectedSize); // Pass selectedSize
    }
  };
  
const handleIncreaseQuantity = (product: BagItem) => {
  const stockLimit = product.stockQuantity ?? 0; // Use stockQuantity stored in BagItem
  console.log(
    `Product ${product.name} (${product.selectedSize}): current quantity ${product.quantity}, stockQuantity ${stockLimit}`
  );

  if (product.quantity < stockLimit) {
    updateQuantity(product.id, product.quantity + 1, product.selectedSize); // Include selectedSize
  } else {
    toast.error(`No more stock available for ${product.name} (${product.selectedSize})`);
  }
};


    

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Pirkinių krepšelis
        </h1>

        <form className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">Pasirinkti produktai</h2>

            {shoppingBag.length === 0 ? (
              <p className="text-center text-gray-500 py-6">Krepšelis yra tuščias</p>
            ) : (
              <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {shoppingBag.map((product) => (
                  <li key={product.id} className="flex py-6">
                    <div className="flex-shrink-0">
                      <img
                        alt={product.image?.altText || 'Product Image'}
                        src={product.image?.sourceUrl || '/placeholder.jpg'}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                      <div>
                        <div className="flex justify-between">
                          <div className=" flex flex-col">
                          <h4 className="text-m  text-gray-900">
                            <a href="#" className="font-medium text-gray-700 hover:text-gray-800">
                              {product.name}
                            </a>
                          </h4>
                          <p className="text-sm mt-2  text-gray-600">
                            {product.price} € / {product.selectedSize} ml.
                          </p>
                          </div>
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            {(parseFloat(product.price ?? "0") * product.quantity).toFixed(2)} €
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-1 items-end justify-between">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => handleDecreaseQuantity(product)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 px-2"
                          >
                            -
                          </button>
                          <span className="mx-2">{product.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleIncreaseQuantity(product)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 px-2"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromBag(product.id, product.selectedSize)}
                          className="text-sm font-medium text-red-600 hover:text-red-500"
                        >
                          Ištrinti
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section aria-labelledby="summary-heading" className="mt-10">
            <h2 id="summary-heading" className="sr-only">
              Užsakymo informacija
            </h2>

            <div>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Viso:</dt>
                  <dd className="ml-4 text-base font-medium text-gray-900">
                    {shoppingBag
                      .reduce((total, product) => total + parseFloat(product.price ?? '0') * product.quantity, 0)
                      .toFixed(2)}{' '}
                    €
                  </dd>
                </div>
              </dl>
              <p className="mt-1 text-sm text-gray-500">
                Galutinę kainą matysiti apmokėjime
              </p>
            </div>

            <div className="mt-10">
              <Link href='/payment'>
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Apmokėti
                </button>
              </Link>
            </div>

            <div className="mt-6 text-center text-sm">
              <p>
                <a href="/products" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Testi apsipirkimą
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}


