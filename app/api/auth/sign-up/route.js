// app/api/auth/sign-up/route.js
import { hashPassWord } from '@/lib/authenticate';
import clientPromise from '@/lib/mongoClient';
import { NextResponse } from 'next/server';

async function POST(req) {
	const { email, password } = await req.json();
	console.log('From API route, found email and password: ', email, password);
	if (
		!email ||
		!email.includes('@') ||
		!password ||
		password.trim().length < 8
	) {
		return NextResponse.json(
			{
				status: 422,
			},
			{ message: 'Password is invalid' }
		);
	}

	const client = await clientPromise;
	const db = client.db();

	const existingUser = await db.collection('user').findOne({ email: email });

	if (existingUser) {
		client.close();
		return NextResponse.json(
			{ message: 'This email already exists with a user, try another email?' },
			{
				status: 422,
			}
		);
	}

	const hashedPassword = await hashPassWord(password);

	try {
		const res = await db.collection('user').insertOne({
			email: email,
			password: hashedPassword,
			files: [],
		});
		console.log(res);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: 'This email already exists with a user, try another email?' },
			{
				status: 422,
			}
		);
	}

	client.close();
	return NextResponse.json(
		{
			message: 'User Created!',
		},
		{
			status: 201,
		}
	);
}

async function GET() {
	return NextResponse.json({
		message: 'This API route does not have a GET method',
	});
}

export { POST, GET };
