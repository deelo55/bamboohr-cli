import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerWebhooksCommands(program: Command): void {
  const cmd = program.command('webhooks').description('Manage webhooks');

  cmd
    .command('list')
    .description('List webhooks')
    .action(async () => {
      try {
        output(await api.get('/webhooks/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('get <webhookId>')
    .description('Get a specific webhook')
    .action(async (webhookId: string) => {
      try {
        output(await api.get(`/webhooks/${webhookId}`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create')
    .description('Create a webhook')
    .requiredOption('--data <json>', 'Webhook data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/webhooks/', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update <webhookId>')
    .description('Update a webhook')
    .requiredOption('--data <json>', 'Webhook data as JSON')
    .action(async (webhookId: string, opts) => {
      try {
        output(await api.put(`/webhooks/${webhookId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('delete <webhookId>')
    .description('Delete a webhook')
    .action(async (webhookId: string) => {
      try {
        output(await api.del(`/webhooks/${webhookId}`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('logs <webhookId>')
    .description('Get webhook logs')
    .action(async (webhookId: string) => {
      try {
        output(await api.get(`/webhooks/${webhookId}/logs`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('monitor-fields')
    .description('Get available monitor fields for webhooks')
    .action(async () => {
      try {
        output(await api.get('/webhooks/monitor_fields'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('post-fields')
    .description('Get available post fields for webhooks')
    .action(async () => {
      try {
        output(await api.get('/webhooks/post_fields'));
      } catch (err) {
        handleError(err);
      }
    });
}
