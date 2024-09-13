import type { Config } from 'drizzle-kit';
import { Resource } from 'sst';

export default {
	schema: './server/db/schema.ts',
	out: './server/db/migrations/',
	driver: 'turso',
	dialect: 'sqlite',
	dbCredentials: {
		url: Resource.DB_URL.value,
		authToken: Resource.DB_KEY.value
	}
} satisfies Config;
