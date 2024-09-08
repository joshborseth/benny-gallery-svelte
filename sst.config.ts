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
		const bucket = new sst.aws.Bucket('BennyBucket', {
			public: true
		});

		new sst.aws.SvelteKit('Web', {
			link: [bucket]
		});
	}
});
