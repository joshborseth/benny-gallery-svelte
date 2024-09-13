import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { Resource } from 'sst';

const client = createClient({
	url: Resource.DB_URL.value,
	authToken: Resource.DB_KEY.value
});
export const db = drizzle(client, {
	schema
});
