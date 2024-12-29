'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/authorization";
import { print } from "graphql";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { LoginMutation } from "@/queries/order/LoginQuery";


export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
  
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
  
    try {
      const response = await fetchGraphQL<{
        login: { authToken: string; user: { id: string; email: string } };
      }>(print(LoginMutation), {
        username: email, // Assuming email is used as the username
        password,
      });
  
      if (!response?.login?.authToken) {
        throw new Error("Invalid email or password");
      }
  
      // Save user in context with authToken
      login(response.login.user.email, response.login.user.id, response.login.authToken);
  
      // Redirect to the payment page
      router.push("/payment");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    }
  };
  

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Prisijunkite prie paskyros, kad galėtumėte atlikti užsakymą
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Paštas
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Prisijungti
              </button>
            </div>
          </form>
          <div>
            <p className="mt-10 text-center text-sm text-gray-500">
              Norite susikurti paskyrą?{" "}
              <Link href="/registration" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Registruokities čia
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
