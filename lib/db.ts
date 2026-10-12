import 'server-only';
import {createClient, type Client} from '@libsql/client';

let client: Client | undefined;

// Build workers import route modules without runtime credentials. Connect only
// when a server request actually needs data; never substitute another store.
export function getDb(): Client {
 if (client) return client;
 const url = process.env.TURSO_DATABASE_URL;
 const authToken = process.env.TURSO_AUTH_TOKEN;
 if (!url || !authToken) {
  throw new Error('Turso server credentials are not configured.');
 }
 client = createClient({url, authToken});
 return client;
}
