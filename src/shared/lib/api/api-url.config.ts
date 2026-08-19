// NEXT_PUBLIC_ is required because this value is used by Axios in the browser.
// Next.js automatically loads the value from the file for the current environment.
const apiBaseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

if (!apiBaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SERVER_API_URL environment variable');
}

// Keeping the URL without a trailing slash prevents accidental double slashes.
export const API_BASE_URL = apiBaseUrl.replace(/\/$/, '');
