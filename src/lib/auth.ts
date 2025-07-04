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
                    id: '',
                    email: result.data.email,
                    name: result.data.email,
                    accessToken: result.data.accessToken,
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken
                token.email = user.email
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.accessToken = token.accessToken
                session.user = {
                    id: '',
                    email: token.email ?? '',
                    accessToken: token.accessToken ?? '',
                }
            }

            return session
        }
    }
}
