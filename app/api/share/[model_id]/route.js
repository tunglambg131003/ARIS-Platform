import clientPromise from '@/lib/mongoClient';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

async function POST(req) {
    try {
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
