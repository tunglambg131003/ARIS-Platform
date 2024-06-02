// app/api/get-uploaded-model.js

import clientPromise from '@/lib/mongoClient';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({
				status: 401,
				body: { message: 'No session found' },
			});
		}
		console.log('from /api/user/models/route.js: ', session);

		const request = await req.json();
		const client = await clientPromise;
		const db = client.db();
		const fileCollection = db.collection('files');

		const fileResponse = await fileCollection.findOne({
			_id: new ObjectId(request.fileID),
		});

		if (!fileResponse) {
			return NextResponse.json({
				status: 404,
				body: { message: 'No uploaded model found' },
			});
		}

		return NextResponse.json({
			status: 200,
			body: { modelUrl: fileResponse.url },
		});
	} catch {
		return NextResponse.json({
			status: 500,
			body: { message: 'Internal server error' },
		});
	}
}

export { POST };
