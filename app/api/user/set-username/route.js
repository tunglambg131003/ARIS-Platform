// pages/api/set-username.js
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongoClient';
import { authOptions } from '../../auth/[...nextauth]/route';

async function POST(req) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json(
			{
				message: 'Not authenticated',
			},
			{
				status: 401,
			}
		);
	}

	const { username } = await req.json();

	if (!username) {
		return NextResponse.json(
			{
				message: 'Username is required',
			},
			{
				status: 400,
			}
		);
	}

	try {
		const client = await clientPromise;
		const db = client.db();
		const usersCollection = db.collection('user');

		const updateResult = await usersCollection.updateOne(
			{ email: session.user.email },
			{ $set: { username } }
		);

		if (updateResult.modifiedCount === 1) {
			return NextResponse.json(
				{
					message: 'Username set successfully',
					username: username,
				},
				{
					status: 200,
				}
			);
		} else {
			return NextResponse.json(
				{
					message: 'Failed to set username',
				},
				{
					status: 500,
				}
			);
		}
	} catch (error) {
		console.error('Error setting username:', error);
		return NextResponse.json(
			{
				message: 'Internal server error',
				error: error.message,
			},
			{
				status: 500,
			}
		);
	}
}

export { POST };
