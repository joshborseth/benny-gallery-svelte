//eslint-disable-next-line
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'benny-gallery-svelte',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			home: 'aws'
		};
	},
	async run() {
		const beforeBucket = new sst.aws.Bucket('BeforeBucket', {
			public: true
		});

		const afterBucket = new sst.aws.Bucket('AfterBucket', {
			public: true
		});

		const webPConverter = new sst.aws.Function('WebPConverter', {
			url: true,
			memory: '2 GB',
			timeout: '15 minutes',
			handler: './server/index.handler',
			nodejs: { install: ['ffmpeg-static'] },
			link: [beforeBucket, afterBucket]
		});

		new sst.aws.SvelteKit('Web', {
			link: [beforeBucket, afterBucket]
		});
		return {
			url: webPConverter.url
		};
	}
});
