// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signInService } from './services/auth/signIn'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const result = await signInService({ email: credentials.email, password: credentials.password })

                if (!result.isSuccess) throw new Error(result.error)

                return {
                    id: 0,
                    name: result.data.email,
                    email: result.data.email,
                    accessToken: result.data.accessToken
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken as string
                token.user = {
                    username: user.username,
                    name: user.name as string
                }
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.accessToken = token.accessToken
                session.user = {
                    name: token.user?.name,
                    username: token.user?.username
                }
            }

            return session
        }
    }
}
