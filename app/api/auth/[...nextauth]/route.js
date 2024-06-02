// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
// import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongoClient';
import { verifyPassword } from '@/lib/authenticate';

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
				const usersCollection = client.db().collection('user');
				const user = await usersCollection.findOne({
					email: credentials.email,
				});

				if (!user) {
					// client.close();
					throw new Error('Found nothing');
				}

				const isValid = await verifyPassword(
					credentials.password,
					user.password
				);

				if (!isValid) {
					// client.close();
					throw new Error('Cust');
				}

				// client.close();
				console.log('Authenticated Succesfully!');
				return {
					id: user._id.toString(),
					email: user.email,
					// randomKey: 'lmaoguesswhat',
				};
			},
		}),
	],
	session: { strategy: 'jwt' },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
