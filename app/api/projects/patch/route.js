import { S3 } from 'aws-sdk';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import clientPromise from '@/lib/mongoClient';
import { getFileURL } from '@/lib/utils';

const s3 = new S3({
	endpoint: process.env.DO_ORIGIN,
	credentials: {
		accessKeyId: process.env.DO_KEY,
		secretAccessKey: process.env.DO_SECRET,
	},
	forcePathStyle: false,
	region: 'sgp1',
});

const MAX_DATA_LIMIT = 104857600; // Example: 100 MB limit

async function POST(req) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json(
			{
				message: 'No session found',
			},
			{
				status: 401,
			}
		);
	}

	const form = await req.formData();
	const user = form.get('user');

	if (user !== session.user?.username) {
		console.log(session.user?.username);
		console.log(user);
		return NextResponse.json(
			{
				message: 'Unauthorized',
			},
			{
				status: 401,
			}
		);
	}

	const file = form.get('file');
	const fileName = form.get('filename');
	const projectName = form.get('projectName');

	const isFile = file instanceof File;

	if (!fileName || !isFile) {
		return NextResponse.json(
			{
				message: 'File name and content are required',
			},
			{
				status: 400,
			}
		);
	}

	const buffer = await file.arrayBuffer();
	const fileSizeInBytes = buffer.byteLength;

	try {
		const client = await clientPromise;
		const db = client.db();
		const userCollection = db.collection('user');

		// Fetch current data usage and data limit
		const userDoc = await userCollection.findOne({
			username: session.user.username,
		});
		const currentDataUsage = userDoc.dataUsage || 0;
		const dataLimit = userDoc.dataLimit || MAX_DATA_LIMIT;

		let deletedFileSizeInBytes = 0;
		let projectedDataUsage = 0;

		const headParams = {
			Bucket: process.env.DO_BUCKET,
			Key: fileName,
		};

		try {
			const headData = await s3.headObject(headParams).promise();
			deletedFileSizeInBytes = headData.ContentLength;

			projectedDataUsage =
				currentDataUsage - deletedFileSizeInBytes + fileSizeInBytes;

			if (projectedDataUsage > dataLimit) {
				return NextResponse.json(
					{
						message: 'Data limit exceeded, aborting operation.',
					},
					{
						status: 403,
					}
				);
			}

			const deleteParams = {
				Bucket: process.env.DO_BUCKET,
				Key: fileName,
			};

			await s3.deleteObject(deleteParams).promise();
			console.log(`Deleted existing file ${fileName}`);
		} catch (error) {
			if (error.code === 'NotFound') {
				console.log(`File ${fileName} does not exist, creating a new one...`);
			} else {
				throw error;
			}
		}

		const uploadParams = {
			Bucket: process.env.DO_BUCKET,
			Key: fileName,
			Body: Buffer.from(buffer),
			ContentType: 'model/gltf-binary', // Change to the appropriate MIME type
			ACL: 'public-read', // Adjust according to your requirements
		};

		await s3.putObject(uploadParams).promise();
		console.log(`Uploaded new file ${fileName}`);

		// const projectCollection = db.collection('projects');
		// const projectIdentifier = `${user}/${projectName}`;

		// don't really have to do this because file name never changes
		// const updateResult = await projectCollection.updateOne(
		// 	{ projectIdentifier },
		// 	{ $set: { file: getFileURL(fileName) } }
		// );

		// if (updateResult.modifiedCount === 1) {
		// 	console.log(
		// 		`Successfully updated project ${projectIdentifier} with new file ${fileName}`
		// 	);
		// } else {
		// 	console.log(`Failed to update project ${projectIdentifier}`);
		// 	return NextResponse.json(
		// 		{
		// 			message: 'Failed to update project',
		// 		},
		// 		{
		// 			status: 500,
		// 		}
		// 	);
		// }

		// Update user's data usage
		await userCollection.updateOne(
			{ email: session.user.email },
			{ $inc: { dataUsage: fileSizeInBytes - deletedFileSizeInBytes } }
		);

		return NextResponse.json(
			{
				message: 'File uploaded successfully',
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error('Error handling file:', error);
		return NextResponse.json(
			{
				message: 'Internal server error',
			},
			{
				status: 500,
			}
		);
	}
}

export { POST };
