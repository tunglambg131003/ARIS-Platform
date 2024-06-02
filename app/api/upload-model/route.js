// app/api/upload-model/route.js
import clientPromise from '@/lib/mongoClient';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { File } from 'buffer';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import { generateModifiedFilename, getFileURL } from '@/lib/utils';

const s3Client = new S3({
	endpoint: process.env.DO_ORIGIN,
	credentials: {
		accessKeyId: process.env.DO_KEY,
		secretAccessKey: process.env.DO_SECRET,
	},
	forcePathStyle: false,
	region: 'sgp1',
});

async function POST(request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		console.log("You can't upload without a session!");
		return new NextResponse({
			status: 401,
			body: { message: 'You are not authenticated!' },
		});
	}

	try {
		const form = await request.formData();
		const file = form.get('file');

		if (!file)
			return NextResponse.json({
				status: 401,
				body: { message: 'No file detected' },
			});

		const isFile = file instanceof File;

		if (!isFile)
			return NextResponse.json({
				status: 401,
				body: { message: 'File type not of File Type' },
			});

		const buffer = await file.arrayBuffer();
		const newName = generateModifiedFilename(file.name);
		const data = await s3Client.send(
			new PutObjectCommand({
				Bucket: process.env.DO_BUCKET,
				Key: newName,
				Body: Buffer.from(buffer),
				ACL: 'public-read',
			})
		);
		console.log(data);

		const client = await clientPromise;
		const db = client.db();
		const fileCollection = db.collection('files');

		const fileInsert = {
			name: file.name,
			url: getFileURL(newName),
			belongsTo: session.user.email,
			createdAt: new Date(),
		};
		const fileResponse = await fileCollection.insertOne(fileInsert);
		console.log('From fileResponse of upload-model: ', fileResponse);

		// extract _id from fileResponse
		const insertedFileId = fileResponse.insertedId.toString();
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
			body: { modelID: insertedFileId, message: 'File uploaded successfully' },
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			status: 500,
			body: { error: error, message: 'Internal server error' },
		});
	}
}

export { POST };
