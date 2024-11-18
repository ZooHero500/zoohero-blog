// @ts-ignore
import { createDirectus, rest, staticToken } from '@directus/sdk';

if (!process.env.DIRECTUS_URL) {
  throw new Error('DIRECTUS_URL is not defined');
}


// Initialize the Directus client with static token
export const directusClient = createDirectus(process.env.DIRECTUS_URL)
  .with(staticToken(process.env.DIRECTUS_TOKEN))
  .with(rest());