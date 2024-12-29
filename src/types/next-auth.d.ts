import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string | null
  }

  interface Session {
    accessToken: string
    user: {
      id: string
      name: string
      email: string | null
    }
  }

  interface JWT {
    accessToken: string
    id: string
    name: string
    email: string | null
  }
}
