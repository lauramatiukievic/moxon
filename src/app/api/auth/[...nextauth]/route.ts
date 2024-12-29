import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { LoginMutation } from '@/queries/order/LoginQuery'


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: LoginMutation,
              variables: {
                username: credentials?.username,
                password: credentials?.password,
              },
            }),
          })
          const data = await response.json()
      
          if (data?.data?.login?.authToken) {
            return {
              id: data.data.login.user.id,
              name: data.data.login.user.name,
              email: null, // Handle users without an email
              token: data.data.login.authToken,
            }
          }
          return null
        } catch (error) {
          console.error("Login Error:", error)
          return null
        }
      }
      
      
    }),
  ],
  callbacks: {
    session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email || "unknown@example.com", // Provide a fallback email
        emailVerified: null, 
      }
      return session
    },
  },
  

  
  
  
  
  
})

export { handler as GET, handler as POST }
