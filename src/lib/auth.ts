// ============================================
// NEXT AUTH - CONFIGURACI�"N BÁSICA (PLACEHOLDER)
// ============================================

// TODO: Completar configuraci�n de NextAuth
// Este archivo es un placeholder para futuras implementaciones

/*
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Llamar a la API para validar credenciales
        // TODO: Retornar usuario si es v�lido
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // TODO: Agregar rol de admin si aplica
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // TODO: Agregar rol de admin
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
*/

const authPlaceholder = {};

export default authPlaceholder;

