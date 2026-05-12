import { Command } from 'commander';
import { loginWithApiKey } from '../auth/api-key.js';
import { loginWithOAuth } from '../auth/oauth.js';
import { loadConfig, clearConfig } from '../config.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

function resolveSecret(flagValue: string | undefined, envVar: string, label: string): string {
  const value = flagValue ?? process.env[envVar];
  if (!value) {
    throw new Error(`Missing ${label}. Provide --${label.toLowerCase().replace(/\s+/g, '-')} or set ${envVar}.`);
  }
  return value;
}

export function registerLoginCommand(program: Command): void {
  program
    .command('login')
    .description('Authenticate with BambooHR using an API key')
    .option('--domain <domain>', 'Your BambooHR company domain (or set BAMBOOHR_DOMAIN)')
    .option('--api-key <key>', 'Your BambooHR API key (or set BAMBOOHR_API_KEY)')
    .action(async (opts) => {
      try {
        const domain = opts.domain ?? process.env.BAMBOOHR_DOMAIN;
        if (!domain) throw new Error('Missing domain. Provide --domain or set BAMBOOHR_DOMAIN.');
        const apiKey = resolveSecret(opts.apiKey, 'BAMBOOHR_API_KEY', 'api key');
        await loginWithApiKey(domain, apiKey);
        output({ status: 'ok', method: 'api-key', domain });
      } catch (err) {
        handleError(err);
      }
    });

  program
    .command('login-oauth')
    .description('Authenticate with BambooHR using OAuth')
    .option('--domain <domain>', 'Your BambooHR company domain (or set BAMBOOHR_DOMAIN)')
    .option('--client-id <id>', 'OAuth application client ID (or set BAMBOOHR_CLIENT_ID)')
    .option('--client-secret <secret>', 'OAuth application client secret (or set BAMBOOHR_CLIENT_SECRET)')
    .action(async (opts) => {
      try {
        const domain = opts.domain ?? process.env.BAMBOOHR_DOMAIN;
        if (!domain) throw new Error('Missing domain. Provide --domain or set BAMBOOHR_DOMAIN.');
        const clientId = resolveSecret(opts.clientId, 'BAMBOOHR_CLIENT_ID', 'client id');
        const clientSecret = resolveSecret(opts.clientSecret, 'BAMBOOHR_CLIENT_SECRET', 'client secret');
        await loginWithOAuth(domain, clientId, clientSecret);
        output({ status: 'ok', method: 'oauth', domain });
      } catch (err) {
        handleError(err);
      }
    });

  program
    .command('logout')
    .description('Clear stored credentials')
    .action(() => {
      try {
        clearConfig();
        output({ status: 'logged out' });
      } catch (err) {
        handleError(err);
      }
    });

  program
    .command('status')
    .description('Show current authentication status')
    .action(() => {
      try {
        const config = loadConfig();
        if (!config.companyDomain || !config.auth) {
          output({ authenticated: false });
        } else {
          output({
            authenticated: true,
            domain: config.companyDomain,
            method: config.auth.method,
          });
        }
      } catch (err) {
        handleError(err);
      }
    });
}
