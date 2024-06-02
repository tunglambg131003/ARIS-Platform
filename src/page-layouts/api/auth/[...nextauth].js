//src/page-layouts/api/auth/[...nextauth].js
// legacy, TODO: remove

import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import { connectoDatabase } from '@/src/lib/db';
import { verifyPassword } from '@/src/lib/authenticate';

export default NextAuth({
	session: {
		jwt: true,
	},
	providers: [
		Providers.Credentials({
			async authorize(credentials) {
				const client = await connectoDatabase();

				const usersCollection = client.db().collection('user');

				const users = await usersCollection.findOne({
					email: credentials.email,
				});

				if (!users) {
					client.close();
					throw new Error('Found nothing');
				}

				const isValid = await verifyPassword(
					credentials.password,
					users.password
				);

				if (!isValid) {
					client.close();
					throw new Error('Cust');
				}
				client.close();
				return { email: users.email };
			},
		}),
	],
});
