import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { spawnSync } from 'child_process';
import { pipeline, Readable } from 'stream';
import { promisify } from 'util';
import { Resource } from 'sst';
import { db } from './db';
import { image } from './db/schema';
import { REGION } from '../constants/region';

type S3ObjectCreatedEvent = {
	Records: Array<{
		eventVersion: string;
		eventSource: string;
		awsRegion: string;
		eventTime: string;
		eventName: string;
		userIdentity: {
			principalId: string;
		};
		requestParameters: {
			sourceIPAddress: string;
		};
		responseElements: {
			'x-amz-request-id': string;
			'x-amz-id-2': string;
		};
		s3: {
			s3SchemaVersion: string;
			configurationId: string;
			bucket: {
				name: string;
				ownerIdentity: {
					principalId: string;
				};
				arn: string;
			};
			object: {
				key: string;
				size: number;
				eTag: string;
				versionId?: string;
				sequencer: string;
			};
		};
	}>;
};

const s3Client = new S3Client({});
const pipelineAsync = promisify(pipeline);

const buildUrl = ({ bucket, key }: { bucket: string; key: string }) =>
	`https://${bucket}.s3.${REGION}.amazonaws.com/${encodeURI(key)}`;

export async function handler(event: S3ObjectCreatedEvent) {
	const key = event.Records[0].s3.object.key;
	const imagePath = path.join('/tmp', `original-${key}.webp`);
	const outputPath = path.join('/tmp', `converted-${key}.webp`);

	console.log('Downloading file from S3...');
	const originalImage = await downloadFromS3(imagePath, key);
	console.log('Download complete.');

	const ffmpegParams = ['-i', imagePath, '-vcodec', 'libwebp', outputPath];

	console.log('Generating webp file...');
	const result = spawnSync(ffmpeg!, ffmpegParams, { stdio: 'pipe' });
	if (result.error) {
		console.error('Error running ffmpeg:', result.error);
		throw new Error('Error processing file with ffmpeg');
	}

	const stderr = result.stderr.toString();
	if (stderr) {
		console.error('ffmpeg stderr:', stderr);
	}

	const stdout = result.stdout.toString();
	if (stdout) {
		console.log('ffmpeg stdout:', stdout);
	}
	const fileExists = await fsPromises.stat(outputPath).catch(() => false);
	if (!fileExists) {
		throw new Error(`File was not generated: ${outputPath}`);
	}

	console.log('File generated:', outputPath);

	const img = await fsPromises.readFile(outputPath);

	const convertedImage = await uploadToS3(img, key);

	await db.insert(image).values({
		originalImageUrl: originalImage.url,
		convertedImageUrl: convertedImage.url
	});
}

async function downloadFromS3(downloadPath: string, key: string) {
	const command = new GetObjectCommand({ Bucket: Resource.BeforeBucket.name, Key: key });

	try {
		const response = await s3Client.send(command);

		if (response.Body instanceof Readable) {
			const writeStream = fs.createWriteStream(downloadPath);

			await pipelineAsync(response.Body, writeStream);

			console.log('File downloaded to', downloadPath);
		} else {
			throw new Error('Response body is not a readable stream.');
		}
	} catch (err) {
		console.error('Error downloading file from S3:', err);
		throw err;
	}

	return {
		url: buildUrl({ bucket: Resource.BeforeBucket.name, key })
	};
}

async function uploadToS3(file: Buffer, key: string) {
	try {
		const command = new PutObjectCommand({
			Key: key,
			Bucket: Resource.AfterBucket.name,
			Body: file,
			ContentType: 'image/webp'
		});

		await s3Client.send(command);
		if (!command.input.Key)
			throw new Error(
				'Object was sent to s3 without a key. This would make absolutely no sense to me.'
			);
		return { url: buildUrl({ bucket: Resource.AfterBucket.name, key }) };
	} catch (err) {
		console.error('Error uploading file to S3:', err);
		throw err;
	}
}
