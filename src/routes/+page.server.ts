import { db } from '../../server/db';
import { Resource } from 'sst';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function load() {
	const command = new PutObjectCommand({
		Key: crypto.randomUUID(),
		Bucket: Resource.BeforeBucket.name
	});
	const url = await getSignedUrl(new S3Client({}), command);

	const images = await db.query.image.findMany();

	return { url, images };
}
