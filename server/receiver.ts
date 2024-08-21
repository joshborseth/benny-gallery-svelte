import { bus } from 'sst/aws/bus';
import { MyEvent } from './index';

export const handler = bus.subscriber(MyEvent, async (evt, raw) => {
	console.log({ evt, raw });
});
