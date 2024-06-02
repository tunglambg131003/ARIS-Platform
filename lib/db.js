//lib/db.js
import { MongoClient } from 'mongodb';

export async function connectoDatabase() {
	const client = await MongoClient.connect(process.env.MONGODB_URI);
	return client;
}
