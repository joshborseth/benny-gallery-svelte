//TODO: refactor this later
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { spawnSync } from 'child_process';
import { pipeline, Readable } from 'stream';
import { promisify } from 'util';
import { Resource } from 'sst';

const s3Client = new S3Client({});
const pipelineAsync = promisify(pipeline);

export async function handler() {
	const imagePath = path.join('/tmp', 'input.jpg');
	const outputFile = 'output.webp';
	const outputPath = process.env.SST_DEV ? outputFile : path.join('/tmp', outputFile);
	try {
		console.log('Downloading video from S3...');
		await downloadFromS3(imagePath);
		console.log('Download complete.');

		const ffmpegParams = ['-i', imagePath, '-vcodec', 'libwebp', outputPath];

		console.log('Generating thumbnail...');
		const result = spawnSync(ffmpeg!, ffmpegParams, { stdio: 'pipe' });
		if (result.error) {
			console.error('Error running ffmpeg:', result.error);
			throw new Error('Error processing video with ffmpeg');
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
			throw new Error(`Thumbnail file was not generated: ${outputPath}`);
		}

		console.log('Thumbnail generated:', outputPath);

		const img = await fsPromises.readFile(outputPath);

		const body = Buffer.from(img).toString('base64');
		return {
			body,
			statusCode: 200,
			isBase64Encoded: true,
			headers: {
				'Content-Type': 'image/webp',
				'Content-Disposition': 'inline'
			}
		};
	} catch (err) {
		console.error('Error:', err);
		return {
			body: JSON.stringify({ error: err.message }),
			statusCode: 500
		};
	}
}

async function downloadFromS3(downloadPath: string) {
	const command = new GetObjectCommand({ Bucket: Resource.BeforeBucket.name, Key: 'bert' });

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
}
