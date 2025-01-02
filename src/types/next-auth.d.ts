import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string | null
    accessToken?: string
  }

  interface Session {
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    id?: string
    name?: string
    email?: string | null
  }
}
