'use client'
import { submitContactForm } from '@/actions/contact'
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { useActionState } from 'react'

export default function Example() {
  const [state, action, isPending] = useActionState(submitContactForm, { success: false, message: '' })


  return (
    <div className="relative isolate bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className=" mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Susisiekite
            </h2>
            <p className="mt-6 text-lg/8 text-gray-600">
              Kilus klausimų, galite su mumis susisiekti. Taip pat kviečiame pamatyti mūsų socialinius tinklus.
            </p>
            <dl className="mt-10 space-y-4 text-base/7 text-gray-600">
            <h2 className='font-semibold text-2xl text-gray-900'>Rekvizitai:</h2>
            <dt className="flex-none">
                  <span className="">Arneta Vaitkevičiūtė</span>
                </dt>
              <div className="flex gap-x-4">
             
                <dt className="flex-none">
                  <span className="sr-only">Telefonas</span>
                  <PhoneIcon aria-hidden="true" className="h-7 w-6 text-gray-400" />
                </dt>
                <dd>
                  <a href="tel:+37060729214" className="hover:text-gray-900">
                  +37060729214
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Elektroninis paštas</span>
                  <EnvelopeIcon aria-hidden="true" className="h-7 w-6 text-gray-400" />
                </dt>
                <dd>
                  <a href="mailto:moxon.lt8@gmail.com" className="hover:text-gray-900">
                  moxon.lt8@gmail.com
                  </a>
                </dd>

              </div>
              <dt className="flex-none">
                  <span className="">individ. veiklos nr. 1359473</span>
                </dt>
            </dl>
          </div>
        </div>
        <form action={action}  className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
                  Vardas
                </label>
                <div className="mt-2.5">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="given-name"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
                  Pavardė
                </label>
                <div className="mt-2.5">
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
                 Elektroninis paštas
                </label>
                <div className="mt-2.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm/6 font-semibold text-gray-900">
                  Telefono numeris
                </label>
                <div className="mt-2.5">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
                  Žinutė
                </label>
                <div className="mt-2.5">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    defaultValue={''}
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Siųsti žinutę
              </button>
            </div>
                            {state?.message && (
                    <div className={`alert ${state.success ? 'alert-success' : 'alert-danger'}`}>
                        {state.message}
                    </div>
                )}
          </div>
        </form>
      </div>
    </div>
  )
}
