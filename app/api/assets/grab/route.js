// app/api/get-uploaded-model.js

import clientPromise from '@/lib/mongoClient';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';
import { File } from 'buffer';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import { generateModifiedCopyName, getFileURL } from '@/lib/utils';

const s3Client = new S3({
	endpoint: process.env.DO_ORIGIN,
	credentials: {
		accessKeyId: process.env.DO_KEY,
		secretAccessKey: process.env.DO_SECRET,
	},
	forcePathStyle: false,
	region: 'nyc3',
});

async function GET() {
	const client = await clientPromise;
	const db = client.db();
	const assets = db.collection('templates');

	const assetResponse = await assets.find({});
	const asset = await assetResponse.toArray();
	// console.log(asset);

	return NextResponse.json({
		status: 200,
		body: { assets: asset },
	});
}

async function POST(req) {
	// try {
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
	const assetCollection = db.collection('templates');

	const fileResponse = await assetCollection.findOne({
		_id: new ObjectId(request.assetID),
	});

	// create copy of instance
	const modelData = await fetch(fileResponse.url);
	const modelBuffer = await modelData.arrayBuffer();

	const newName = generateModifiedCopyName(fileResponse.name);

	const data = await s3Client.send(
		new PutObjectCommand({
			Bucket: process.env.DO_BUCKET,
			Key: newName,
			Body: Buffer.from(modelBuffer),
			ACL: 'public-read',
		})
	);
	console.log(data);
	const mongoFileInsertParams = {
		name: fileResponse.name,
		url: getFileURL(newName),
		belongsTo: session.user.email,
		createdAt: new Date(),
		thumbnailUrl: fileResponse.thumbnailUrl,
	};

	if (!fileResponse) {
		return NextResponse.json({
			status: 404,
			body: { message: 'No uploaded model found' },
		});
	}

	const copyResponse = await fileCollection.insertOne(mongoFileInsertParams);
	console.log('From copyResponse of upload-model: ', copyResponse);

	// extract _id from copyResponse
	const insertedFileId = copyResponse.insertedId.toString();
	console.log('From insertedFileId of upload-model: ', insertedFileId);

	const userCollection = db.collection('user');

	const userUpdateResponse = await userCollection.updateOne(
		{ email: session.user.email },
		{ $push: { files: insertedFileId } }
	);

	// console.log('From upload-model api route: ', userUpdateResponse);
	// console.log('upload-model api end');
	if (userUpdateResponse.modifiedCount !== 1) {
		console.log('Failed to update user with file information.');
	}

	return NextResponse.json({
		status: 200,
		body: {
			modelID: insertedFileId,
			message: 'File uploaded successfully',
		},
	});
	// } catch {
	// 	return NextResponse.json({
	// 		status: 500,
	// 		body: { message: 'Internal server error' },
	// 	});
	// }
}

export { POST, GET };
