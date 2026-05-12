import { loadConfig, saveConfig, type Config } from '../config.js';
import { assertValidDomain } from './domain.js';
import { redactErrorBody } from '../utils/errors.js';

export function getApiKeyHeaders(apiKey: string): Record<string, string> {
  const encoded = Buffer.from(`${apiKey}:x`).toString('base64');
  return {
    Authorization: `Basic ${encoded}`,
    Accept: 'application/json',
  };
}

export async function loginWithApiKey(companyDomain: string, apiKey: string): Promise<void> {
  assertValidDomain(companyDomain);

  const headers = getApiKeyHeaders(apiKey);
  const url = `https://api.bamboohr.com/api/gateway.php/${companyDomain}/v1/employees/directory`;
  const res = await fetch(url, { headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Login failed (${res.status}): ${redactErrorBody(body)}`);
  }

  const config: Config = {
    companyDomain,
    auth: {
      method: 'api-key',
      apiKey,
    },
  };
  saveConfig(config);
}
