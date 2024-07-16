//src/page-layouts/api/user/change-passwords.js
// legacy, TODO: remove

import { getSession } from 'next-auth/client';
import { verifyPassword } from '@/src/lib/authenticate';
import { connectoDatabase } from '@/src/lib/db';
import { hashPassWord } from '@/src/lib/authenticate';

async function handler(req, res) {
	if (req.method !== 'PATCH') {
		return;
	}

	const session = await getSession({ req: req });

	if (!session) {
		res.status(422).json({ message: 'Not Authenticated' });
		return;
	}

	const userEmail = session.user.email;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	const client = await connectoDatabase();
	const usercollection = client.db().collection('user');

	const users = await usercollection.findOne({ email: userEmail });

	if (!users) {
		res.status(404).json({ message: 'Cant found user' });
		client.close();
		return;
	}

	const currentPassword = users.password;

	const passwordAreequal = await verifyPassword(oldPassword, currentPassword);

	if (!passwordAreequal) {
		res.status(403).json({ message: 'Not correct' });
		client.close();
		return;
	}

	const hashedPassword = await hashPassWord(newPassword);

	const result = await usercollection.updateOne(
		{ email: userEmail },
		{ $set: { password: hashedPassword } }
	);

	client.close();
	res.status(200).json({ message: 'Update' });
}

export default handler;
