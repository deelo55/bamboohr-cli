import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerReportsCommands(program: Command): void {
  const cmd = program.command('reports').description('Run and manage reports');

  cmd
    .command('list')
    .description('List available reports')
    .action(async () => {
      try {
        output(await api.get('/reports/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('get <reportId>')
    .description('Get a specific report')
    .option('--format <format>', 'Output format (JSON, CSV, XML)', 'JSON')
    .option('--fd', 'Include filter description')
    .action(async (reportId: string, opts) => {
      try {
        const query: Record<string, string> = { format: opts.format };
        if (opts.fd) query.fd = 'yes';
        output(await api.get(`/reports/${reportId}`, query));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('custom')
    .description('Run a custom report')
    .requiredOption('--data <json>', 'Report definition as JSON (fields array, filters, etc.)')
    .option('--format <format>', 'Output format (JSON, CSV, XML)', 'JSON')
    .action(async (opts) => {
      try {
        output(await api.post(`/reports/custom?format=${opts.format}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });
}
