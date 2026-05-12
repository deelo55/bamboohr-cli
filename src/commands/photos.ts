import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerPhotosCommands(program: Command): void {
  const cmd = program.command('photos').description('Manage employee photos');

  cmd
    .command('get <employeeId>')
    .description('Get employee photo')
    .option('--size <size>', 'Photo size (small, medium, large)', 'large')
    .action(async (employeeId: string, opts) => {
      try {
        output(await api.get(`/employees/${employeeId}/photo/${opts.size}`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('upload <employeeId>')
    .description('Upload an employee photo (provide base64 data)')
    .requiredOption('--data <json>', 'Photo data as JSON with base64 content')
    .action(async (employeeId: string, opts) => {
      try {
        output(await api.post(`/employees/${employeeId}/photo`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });
}
