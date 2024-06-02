import { Endpoint } from 'aws-sdk';
import { S3 } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import { NextResponse } from 'next/server';
import fs from 'fs';

const spacesEndpoint = new Endpoint(process.env.DO_ORIGIN); // Replace with your Spaces endpoint
const s3Client = new S3({
	endpoint: spacesEndpoint,
	credentials: {
		accessKeyId: process.env.DO_KEY,
		secretAccessKey: process.env.DO_SECRET,
	},
});

const upload = async (req) => {
	const form = formidable();
	form.parse(req, async (error, fields, files) => {
		if (!files) {
			return NextResponse.json({ message: 'No file found' }, { status: 400 });
		}

		try {
			return s3Client.putObject(
				{
					Bucket: process.env.DO_BUCKET,
					Key: files.file.originalFilename,
					Body: fs.createReadStream(files.file.filepath),
					ACL: 'public-read',
				},
				async () => {
					return NextResponse.json(
						{ message: 'File uploaded successfully' },
						{ status: 200 }
					);
				}
			);
		} catch (error) {
			console.log(error);
			return NextResponse.json(
				{ message: 'Internal server error' },
				{ status: 500 }
			);
		}
	});
};

const getFileUploadURL = (fileName) => {
	const fileURL = `https://${process.env.DO_BUCKET}.${process.env.DO_ORIGIN}/${fileName}`;
	return fileURL;
};

export { getFileUploadURL };
export default upload;
