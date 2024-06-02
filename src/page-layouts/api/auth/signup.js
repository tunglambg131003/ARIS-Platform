//src/page-layouts/api/auth/signup.js
// legacy, TODO: remove

import { hashPassWord } from '@/src/lib/authenticate';
import { connectoDatabase } from '@/src/lib/db';

async function handler(req, res) {
	if (req.method !== 'POST') {
		return;
	}

	const data = req.body;
	const { email, password } = data;

	if (
		!email ||
		!email.includes('@') ||
		!password ||
		password.trim().length < 8
	) {
		res.status(422).json({ message: 'Sai MKhau roi khoa acc' });
		return;
	}

	const client = await connectoDatabase();
	const db = client.db();

	const existingUser = await db.collection('user').findOne({ email: email });

	if (existingUser) {
		res.status(422).json({ message: 'try smt esle' });
		client.close;
		return;
	}

	const hashedPassword = await hashPassWord(password);
	const result = await db.collection('user').insertOne({
		email: email,
		password: hashedPassword,
	});
	res.status(201).json({ message: 'Create User' });
	client.close;
}

export default handler;
