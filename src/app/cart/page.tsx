'use client';

import { BagItem, useShoppingBag } from "@/components/shoppingBagContext";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ShoppingBag() {
  const { shoppingBag, removeFromBag, addToBag, updateQuantity } = useShoppingBag();

  const handleDecreaseQuantity = (product: BagItem) => {
    if (product.quantity > 1) {
      updateQuantity(product.id, product.quantity - 1, product.selectedSize);
    } else {
      removeFromBag(product.id, product.selectedSize);
    }
  };

  const handleIncreaseQuantity = (product: BagItem) => {
    const stockLimit = product.stockQuantity ?? 0;
    if (product.quantity < stockLimit) {
      updateQuantity(product.id, product.quantity + 1, product.selectedSize);
    } else {
      toast.error(`No more stock available for ${product.name} (${product.selectedSize})`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          Pirkinių krepšelis
        </h1>

        <form className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">Pasirinkti produktai</h2>

            {shoppingBag.length === 0 ? (
              <p className="text-center text-gray-500 py-6">Krepšelis yra tuščias</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {shoppingBag.map((product) => (
                  <div key={'' + product.savedVariation + product.selectedColor} className="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        alt={product.image?.altText || 'Product Image'}
                        src={product.image?.sourceUrl || '/placeholder.jpg'}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>

                    <div className="ml-6 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {product.price} € / {product.selectedSize} ml
                          </p>
                          {product.selectedColor && (
                            <p className="mt-1 text-sm text-gray-600 capitalize">
                              {product.selectedColor}
                            </p>
                          )}
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {(parseFloat(product.price ?? "0") * product.quantity).toFixed(2)} €
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => handleDecreaseQuantity(product)}
                            className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm hover:bg-purple-600"
                          >
                            -
                          </button>
                          <span className="mx-4 text-base font-medium">{product.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleIncreaseQuantity(product)}
                            className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm hover:bg-purple-600"
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
                  </div>
                ))}
              </div>
            )}
          </section>

          {shoppingBag.length > 0 && (
            <section aria-labelledby="summary-heading" className="mt-10">
              <h2 id="summary-heading" className="sr-only">
                Užsakymo informacija
              </h2>

              <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-lg font-medium text-gray-900">Viso:</dt>
                  <dd className="text-lg font-bold text-gray-900">
                    {shoppingBag
                      .reduce((total, product) => total + parseFloat(product.price ?? '0') * product.quantity, 0)
                      .toFixed(2)}{' '}
                    €
                  </dd>
                </div>
                <p className="mt-1 text-sm text-gray-500">Galutinę kainą matysiti apmokėjime</p>
              </div>

              <div className="mt-6">
                <Link href='/checkout'>
                  <button
                    type="submit"
                    className="w-full rounded-md bg-purple-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Apmokėti
                  </button>
                </Link>
              </div>

              <div className="mt-6 text-center text-sm">
                <p>
                  <a href="/products" className="font-medium text-purple-500 hover:text-purple-400">
                    Testi apsipirkimą
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                </p>
              </div>
            </section>
          )}
        </form>
      </div>
    </div>
  );
}

