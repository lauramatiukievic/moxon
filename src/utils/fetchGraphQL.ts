import { Session } from "next-auth";

export async function fetchGraphQL<T = any>(
  query: string,
  variables?: { [key: string]: any },
  session?: Session | null,
  headers?: { [key: string]: string },
): Promise<T> {
  try {

    const body = JSON.stringify({
      query,
      variables,
    });

    let authToken: string | null = null;

    console.log('session data: ', session)
    if (session && session.accessToken) {
      console.log('adding token to fetchGraphQL')
      authToken = session.accessToken      
    }

    let requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    }

    if (authToken !== null) {
      requestHeaders = {
        ...requestHeaders,
        Authorization: `Bearer ${authToken}`
      }
    }

    console.log('Request headers:', requestHeaders)

    // Make the fetch request
    const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`, {
      method: "POST",
      headers: requestHeaders,
      body,
    });


    if (!response.ok) {
      console.error("Response Status:", response);
      throw new Error(response.statusText);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL Errors:", JSON.stringify(data.errors, null, 2));
      throw new Error(data.errors[0]?.message || "Error executing GraphQL query");
    }

    return data.data;
  } catch (error) {
    console.error("Fetch GraphQL Error:", error);
    throw error;
  }
}
