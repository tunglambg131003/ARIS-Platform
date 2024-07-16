// pages/api/getProjectFile.js
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongoClient';
import { authOptions } from '../../auth/[...nextauth]/route';

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

	const { activeUser, projectName } = await req.json();
	// console.log(session);
	if (activeUser != session.user?.username) {
		return NextResponse.json(
			{
				message: 'Unauthorized',
			},
			{
				status: 401,
			}
		);
	}

	const projectIdentifier = activeUser + '/' + projectName;

	try {
		const client = await clientPromise;
		const db = client.db();
		const projectCollection = db.collection('projects');

		const project = await projectCollection.findOne({ projectIdentifier });

		if (!project) {
			return NextResponse.json(
				{
					message: 'Project not found',
				},
				{
					status: 404,
				}
			);
		}

		const fileUrl = project.file;

		return NextResponse.json(
			{
				file: fileUrl,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error('Error fetching project:', error);
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
