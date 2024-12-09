export async function fetchGraphQL<T = any>(
  query: string,
  variables?: { [key: string]: any },
  headers?: { [key: string]: string },
): Promise<T> {
  try {
    // Build the body for the GraphQL request
    const body = JSON.stringify({
      query,
      variables,
    });

    
    // Make the fetch request
    const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
        // Use the WP_USER and WP_APP_PASS for basic authentication if needed
        Authorization: `Basic ${btoa(`${process.env.WP_USER}:${process.env.WP_APP_PASS}`)}`,
      },
      body,
    });

    if (!response.ok) {
      console.error("Response Status:", response);
      throw new Error(response.statusText);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
      throw new Error("Error executing GraphQL query");
    }

    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
