import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/lib/mongoClient';
import { verifyPassword, hashPassWord } from '@/lib/authenticate';

const isProduction = process.env.NODE_ENV === 'production';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection('user').findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error('Found nothing');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error('Invalid password');
        }

        console.log('Authenticated Successfully!');
        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username, // Include the username
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          // Set the correct redirect URI based on the environment
          redirect_uri: isProduction
            ? 'http://vinspace.site/api/auth/callback/google'
            : 'http://localhost:3000/api/auth/callback/google',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        console.log(session);
        token.username = session.username;
      }
      if (user) {
        token.id = user.id;
        token.username = user.username || null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username || null;
      return session;
    },
    async signIn({ user, account }) {
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection('user');

      const existingUser = await usersCollection.findOne({
        email: user.email,
      });

      if (account.provider === 'google') {
        if (!existingUser) {
          const hashedPassword = await hashPassWord(
            Math.random().toString(36).slice(-8)
          );
          const userResponse = await usersCollection.insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            password: hashedPassword,
            username: 'temp_username_' + user.email,
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            plan: null,
            dataLimit: null,
            projects: [],
          });
          return true;
        } else {
          user.username = existingUser.username;
        }
      } else {
        user.username = existingUser.username;
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
