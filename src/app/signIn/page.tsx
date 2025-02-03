'use client'

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { AuthError } from "next-auth";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const { data: session, status } = useSession(); // Track session state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Local state to track login status

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      await signIn("credentials", {
        redirectTo: '/',
        username: formData.get('username'),
        password: formData.get('password')
      });
    } catch (error) {
      if (error instanceof AuthError) {
        throw new Error("Invalid email or password", error);
      }
      throw error;
    }
  };

  // Watch session state and update the login status
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true); // Set local state when authenticated
    } else {
      setIsLoggedIn(false); // Reset when not authenticated
    }
  }, [status]);

  // Handle loading state
  if (status === "loading") {
    return <div>Loading...</div>; // Optionally, show a loading spinner
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Prisijunkite prie paskyros, kad galėtumėte atlikti užsakymą
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {!isLoggedIn ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Paštas
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="username"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Slaptažodis
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                  Prisijungti
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p>Welcome, {session?.user?.name}</p>
              <Link href="/" className="text-sm font-semibold text-purple-600 hover:text-purple-500">

                  Go to Products
              </Link>
            </div>
          )}

          <div>
            <p className="mt-10 text-center text-sm text-gray-500">
              Norite susikurti paskyrą?{" "}
              <Link href="/registration" className="font-semibold text-purple-600 hover:text-purple-500">
                Registruokities čia
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
