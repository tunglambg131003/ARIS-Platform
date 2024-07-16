import { hashPassWord } from '@/lib/authenticate';
import clientPromise from '@/lib/mongoClient';
import { NextResponse } from 'next/server';

async function POST(req) {
	const { email, password, username, name } = await req.json();

	if (!email.includes('@')) {
		console.log('invalid email');
		return NextResponse.json(
			{ message: 'Invalid Email' },
			{
				status: 422,
			}
		);
	}

	if (password.trim().length < 8) {
		console.log('password too short');
		return NextResponse.json(
			{ message: 'Password must be at least 8 characters long' },
			{
				status: 422,
			}
		);
	}

	const client = await clientPromise;
	const db = client.db();

	const existingUser = await db.collection('user').findOne({ email: email });

	if (existingUser) {
		console.log('email already in use');
		return NextResponse.json(
			{ message: 'This email has already been used' },
			{
				status: 422,
			}
		);
	}

	const existingUser_2 = await db
		.collection('user')
		.findOne({ username: username });

	if (existingUser_2) {
		console.log('username already in use');
		return NextResponse.json(
			{ message: 'This username is already in use' },
			{
				status: 422,
			}
		);
	}

	console.log('all checks passed!');
	const hashedPassword = await hashPassWord(password);
	try {
		const result = await db.collection('user').insertOne({
			email: email,
			username: username,
			name: name,
			password: hashedPassword,
			stripeCustomerId: null,
			stripeSubscriptionId: null,
			plan: null,
			dataLimit: null,
			projects: [],
		});
		return NextResponse.json(
			{ message: 'User susccessfully created!' },
			{
				status: 200,
			}
		);
	} catch (err) {
		return NextResponse.json(
			{ message: 'User creation failed' },
			{
				status: 500,
			}
		);
	}
}

export { POST };
