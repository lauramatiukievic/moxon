'use client';

import { print } from 'graphql';
import React, { useEffect, useState } from 'react';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { StarIcon } from '@heroicons/react/20/solid';
import { GetProductReviews } from '@/queries/reviews/ProductReviewsQuery';
import { WriteReview } from '@/queries/reviews/WriteReviewQuery';
import { Product, WriteReviewInput } from '@/gql/graphql';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

interface ReviewsComponentProps {
  product: Product; // Ensure the productId is correctly passed
}

interface Review {
  id: string;
  content: string;
  author: {
    name: string;
  };
  rating?: number; // Include rating if available
}

export default function ReviewsComponent({ product }: ReviewsComponentProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const productId = product.id

  const averageRating = reviews.reduce((sum, review) => {
    const rating = review.rating || 0
    return sum + rating
  }, 0) / reviews.length


  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchGraphQL<{ product: Product }>(print(GetProductReviews), { productId });

      console.log('response', response)

      const reviews: Review[] = response.product.reviews?.nodes.map((review, index) => ({
        id: review.id,
        content: review.content,
        author: {
          name: review.author?.name
        },
        rating: response.product.reviews?.edges[index].rating
      }) as Review) || []


      console.log('reviews:', reviews)

      setReviews(reviews); // Set reviews
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  // Submit review
  const submitReview = async (content: string, rating: number, author: string) => {
    setLoading(true);
    setError(null);
    const review: WriteReviewInput = {
      commentOn: product.databaseId,
      content,
      rating,
      author,
      authorEmail: "dev-email@wpengine.local"
    }
    console.log('submitting review: ', review)
    try {
      await fetchGraphQL(print(WriteReview), { input: review });


      fetchReviews(); // Refresh reviews after submission
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Atsiliepimas parašytas');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  console.log('product:', product)



  return (
    <>    {product ? (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-32">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Klientų atsiliepimai</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-3 flex items-center">
              <div>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        averageRating && averageRating > rating
                          ? 'text-yellow-400'
                          : 'text-gray-300',
                        'size-5 shrink-0',
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{averageRating} iš 5 žvaigždučių</p>
              </div>
              <p className="ml-2 text-sm text-gray-900"> {reviews.length} Atsiliepimai</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Atsiliepimų informacija</h3>
              <dl className="space-y-3"></dl>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900">Pasidalink savo nuomonę</h3>
              <p className="mt-1 text-sm text-gray-600">
                Jei bandėte šį produktą, pasidalinkite apie jį su kitais klientais
              </p>

              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
              >
                {showForm ? 'Slėpti' : 'Rašyti atsiliepimą'}
              </button>

              {showForm && (
                <div className="mt-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const contentInput = form.elements.namedItem('content') as HTMLTextAreaElement;
                      const ratingInput = form.elements.namedItem('rating') as HTMLInputElement;
                      const authorInput = form.elements.namedItem('author') as HTMLInputElement;

                      const content = contentInput?.value.trim();
                      const rating = parseInt(ratingInput?.value, 10);
                      const author = authorInput?.value.trim();

                      if (!content || !author || isNaN(rating) || rating < 1 || rating > 5) {
                        setError('Please provide valid content, author name, and a rating between 1 and 5.');
                        return;
                      }

                      submitReview(content, rating, author);
                      form.reset();
                      setShowForm(false);
                    }}
                    className="mt-6"
                  >
                    <input
                      type="text"
                      name="author"
                      placeholder="Vardas"
                      className="w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                      required
                    />
                    <textarea
                      name="content"
                      placeholder="Atsiliepimą rašykite čia"
                      className="w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                      required
                    />
                    <input
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      placeholder="Įvertinimas(1-5)"
                      className="w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-purple-500 text-white rounded-md px-4 py-2 hover:bg-purple-700"
                    >
                      Rašyti atsiliepimą
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <h3 className="sr-only">Paskutiniai atsiliepimai</h3>
            <div className="flow-root">
              <div className="-my-12 divide-y divide-gray-200">
                {reviews.map((review) => (
                  <div key={review.id} className="py-12">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{review.author?.name || 'Anonymous'}</h4>
                      <p className="sr-only">{review.rating} iš 5 žvaigždučių</p>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: review.content }}
                      className="mt-4 space-y-6 text-base italic text-gray-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (<></>)}
    </>

  );
}
