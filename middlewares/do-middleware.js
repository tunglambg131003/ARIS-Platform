import { Endpoint } from 'aws-sdk';
import { S3 } from '@aws-sdk/client-s3';
import multer from 'multer';
import s3Storage from 'multer-s3';

const spacesEndpoint = new Endpoint(process.env.DO_ORIGIN); // Replace with your Spaces endpoint
const s3 = new S3({
	endpoint: spacesEndpoint,
	credentials: {
		accessKeyId: process.env.DO_KEY,
		secretAccessKey: process.env.DO_SECRET,
	},
});

const upload = multer({
	storage: s3Storage({
		s3: s3,
		bucket: process.env.DO_BUCKET,
		acl: 'public-read',
		key: function (request, file, cb) {
			console.log(file);
			cb(null, file.originalname);
		},
	}),
});

const getFileUploadURL = (fileName) => {
	const fileURL = `https://${process.env.DO_BUCKET}.${process.env.DO_ORIGIN}/${fileName}`;
	return fileURL;
};

export { getFileUploadURL };
export default upload;
