import clientPromise from './mongoClient.mjs';

async function setupIndexes() {
	try {
		const client = await clientPromise;
		const db = client.db();

		const projectCollection = db.collection('projects');
		await projectCollection.createIndex({ owner: 1 });
		await projectCollection.createIndex(
			{ projectIdentifier: 1 },
			{ unique: true }
		);

		const userCollection = db.collection('user');
		await userCollection.createIndex({ email: 1 }, { unique: true });
		await userCollection.createIndex({ username: 1 }, { unique: true });

		console.log('Indexes created successfully');
		process.exit(0);
	} catch (error) {
		console.error('Error creating indexes:', error);
		process.exit(1);
	}
}

setupIndexes();
