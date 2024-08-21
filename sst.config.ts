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
		new sst.aws.SvelteKit('Web');
		const bus = new sst.aws.Bus('Bus');

		const fn = new sst.aws.Function('Fn', {
			handler: './server/index.handler',
			url: true,
			link: [bus]
		});
		bus.subscribe('./server/receiver.handler');

		return {
			url: fn.url
		};
	}
});
