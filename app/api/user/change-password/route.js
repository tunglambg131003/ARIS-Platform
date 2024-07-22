//src/page-layouts/api/user/change-passwords.js
// legacy, TODO: remove

import { getSession } from 'next-auth/react';
import { verifyPassword, hashPassWord } from '@/lib/authenticate';
import { connectoDatabase } from '@/lib/db';

async function handler(req, res) {
	if (req.method !== 'PATCH') {
		return;
	}

	const session = await getSession({ req });

	if (!session) {
		res.status(422).json({ message: 'Not Authenticated' });
		return;
	}

	const userEmail = session.user.email;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	const client = await connectoDatabase();
	const userCollection = client.db().collection('user');

	const user = await userCollection.findOne({ email: userEmail });

	if (!user) {
		res.status(404).json({ message: 'User not found' });
		client.close();
		return;
	}

	const currentPassword = user.password;

	const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

	if (!passwordsAreEqual) {
		res.status(403).json({ message: 'Incorrect password' });
		client.close();
		return;
	}

	const hashedPassword = await hashPassWord(newPassword);

	const result = await userCollection.updateOne(
		{ email: userEmail },
		{ $set: { password: hashedPassword } }
	);

	client.close();
	res.status(200).json({ message: 'Password updated' });
}

export default handler;