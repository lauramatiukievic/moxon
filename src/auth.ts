import NextAuth, { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginMutation } from "./queries/order/LoginQuery";
import { print } from "graphql";
import { JWT } from "next-auth/jwt";

function decodeToken(accessToken: string) {
  return JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString()
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {

        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required.");
        }

        try {
          const body = JSON.stringify({
            query: print(LoginMutation),
            variables: {
              username: credentials.username,
              password: credentials.password,
            },
          });

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body,
            }
          );

          if (!response.ok) {
            throw new Error("Failed to log in");
          }

          const data = await response.json();

          const loginData = data?.data?.login;

          if (!loginData || !loginData.authToken || !loginData.user) {
            throw new Error("Invalid login response");
          }

          const result = {
            ...loginData.user,
            accessToken: loginData.authToken,
          }

          console.log('authorized, result: ', result)
          // Return user and token
          return result;
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Invalid credentials.");
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // console.log('jwt callback, token and user:', token, user)
      if (user) {
        token.id = user.id;
        token.name = user.name!;
        token.email = user.email;
        token.accessToken = user.accessToken; // Save authToken as accessToken
      }
      console.log('jwt callback saving token: ', token)
      return token;
    },
    session({ session, token } : {session: Session, token: JWT}) {
      if (token && token.accessToken) {
        session.accessToken = token.accessToken; 
        const decoded = decodeToken(token.accessToken);
        session.expires = new Date(decoded.exp * 1000).toISOString()
      }
      console.log('saving session: ', session)
// Add accessToken to session
      return session;
    },
  },
  session: {
    strategy: "jwt",
  }
});
