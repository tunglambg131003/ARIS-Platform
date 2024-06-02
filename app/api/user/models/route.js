import clientPromise from '@/lib/mongoClient';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

async function POST(req) {
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
}

export { POST };
