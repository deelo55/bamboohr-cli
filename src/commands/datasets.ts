import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerDatasetsCommands(program: Command): void {
  const cmd = program.command('datasets').description('Query and explore datasets');

  cmd
    .command('list')
    .description('List available datasets')
    .action(async () => {
      try {
        output(await api.get('/datasets/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('fields <datasetId>')
    .description('List fields for a dataset')
    .action(async (datasetId: string) => {
      try {
        output(await api.get(`/datasets/${datasetId}/fields`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('field-options <datasetId>')
    .description('Get field options for a dataset')
    .requiredOption('--data <json>', 'Field options request as JSON')
    .action(async (datasetId: string, opts) => {
      try {
        output(await api.post(`/datasets/${datasetId}/field_options`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('query <datasetId>')
    .description('Query a dataset')
    .requiredOption('--data <json>', 'Query data as JSON (filters, fields, pagination)')
    .action(async (datasetId: string, opts) => {
      try {
        output(await api.post(`/datasets/${datasetId}/data`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });
}
