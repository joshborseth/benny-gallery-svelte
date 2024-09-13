//eslint-disable-next-line
/// <reference path="./.sst/platform/config.d.ts" />
import { REGION } from './constants/region';

export default $config({
	app(input) {
		return {
			name: 'benny-gallery-svelte',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			home: 'aws',
			providers: {
				aws: {
					region: REGION
				}
			}
		};
	},
	async run() {
		const DB_URL = new sst.Secret('DB_URL');
		const DB_KEY = new sst.Secret('DB_KEY');

		const beforeBucket = new sst.aws.Bucket('BeforeBucket', {
			public: true
		});

		const afterBucket = new sst.aws.Bucket('AfterBucket', {
			public: true
		});

		beforeBucket.subscribe(
			{
				url: true,
				memory: '2 GB',
				timeout: '15 minutes',
				handler: './server/index.handler',
				nodejs: { install: ['ffmpeg-static'] },
				link: [beforeBucket, afterBucket, DB_URL, DB_KEY]
			},
			{
				events: ['s3:ObjectCreated:*']
			}
		);

		new sst.aws.SvelteKit('Web', {
			link: [beforeBucket, afterBucket, DB_URL, DB_KEY]
		});
	}
});
