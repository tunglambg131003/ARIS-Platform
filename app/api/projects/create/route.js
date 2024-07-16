import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongoClient';

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
	try {
		const { projectName, projectIdentifier, description } = await req.json();

		const client = await clientPromise;
		const db = client.db();
		const projectCollection = db.collection('projects');

		const existingProject = await projectCollection.findOne({
			projectIdentifier: projectIdentifier,
		});

		if (existingProject) {
			return NextResponse.json(
				{
					message: 'Project already exists, try another name?',
				},
				{
					status: 400,
				}
			);
		}

		const project = {
			name: projectName,
			projectIdentifier: projectIdentifier,
			description: description,
			owner: session.user.username,
			createdAt: new Date(),
			updatedAt: new Date(),
			// initalize with null, update later
			file: null,
		};

		const projectResponse = await projectCollection.insertOne(project);
		const projectID = projectResponse.insertedId;

		const userCollection = db.collection('user');

		const userUpdateResponse = await userCollection.updateOne(
			{ email: session.user.email },
			{ $push: { projects: projectIdentifier } }
		);

		if (userUpdateResponse.modifiedCount !== 1) {
			console.log('Failed to update user with file information.');
		}

		return NextResponse.json(
			{
				projectID: projectID,
			},
			{
				status: 200,
			}
		);
	} catch (err) {
		return NextResponse.json(
			{
				error: err,
				message: 'Internal server error',
			},
			{
				status: 500,
			}
		);
	}
}

export { POST };
