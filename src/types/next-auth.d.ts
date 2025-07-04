/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    type User = {
        email: string | null
        accessToken: string
    }

    type Session = {
        user: User,
        accessToken?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
    }
}
