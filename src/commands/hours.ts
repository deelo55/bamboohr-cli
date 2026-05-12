import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerHoursCommands(program: Command): void {
  const cmd = program.command('hours').description('Manage hour records');

  cmd
    .command('get <hourId>')
    .description('Get an hour record')
    .action(async (hourId: string) => {
      try {
        output(await api.get(`/hours/${hourId}`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create')
    .description('Create an hour record')
    .requiredOption('--data <json>', 'Hour record data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/hours/', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update <hourId>')
    .description('Update an hour record')
    .requiredOption('--data <json>', 'Hour record data as JSON')
    .action(async (hourId: string, opts) => {
      try {
        output(await api.put(`/hours/${hourId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('delete <hourId>')
    .description('Delete an hour record')
    .action(async (hourId: string) => {
      try {
        output(await api.del(`/hours/${hourId}`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('bulk')
    .description('Create or update multiple hour records')
    .requiredOption('--data <json>', 'Array of hour records as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/hours/bulk', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });
}
