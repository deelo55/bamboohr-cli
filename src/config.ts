import { homedir } from 'node:os';
import { join } from 'node:path';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

export interface AuthConfig {
  method: 'api-key' | 'oauth';
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface Config {
  companyDomain?: string;
  auth?: AuthConfig;
}

const CONFIG_DIR = join(homedir(), '.bamboohr-cli');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
}

export function loadConfig(): Config {
  try {
    const data = readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function saveConfig(config: Config): void {
  ensureConfigDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), { encoding: 'utf-8', mode: 0o600 });
}

export function clearConfig(): void {
  saveConfig({});
}

export function getBaseUrl(config: Config): string {
  if (!config.companyDomain) {
    throw new Error('Not logged in. Run: bamboo login');
  }
  return `https://api.bamboohr.com/api/gateway.php/${config.companyDomain}/v1`;
}
