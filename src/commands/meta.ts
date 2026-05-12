import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerMetaCommands(program: Command): void {
  const cmd = program.command('meta').description('Account metadata: fields, countries, timezones, users');

  cmd
    .command('fields')
    .description('List configured employee fields')
    .action(async () => {
      try {
        output(await api.get('/meta/fields/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('list-fields')
    .description('List custom list fields')
    .action(async () => {
      try {
        output(await api.get('/meta/lists/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update-list-field <id>')
    .description('Update list field values')
    .requiredOption('--data <json>', 'Field values as JSON')
    .action(async (id: string, opts) => {
      try {
        output(await api.put(`/meta/lists/${id}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('tabular-fields')
    .description('List tabular data fields')
    .action(async () => {
      try {
        output(await api.get('/meta/tables/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('countries')
    .description('List available countries')
    .action(async () => {
      try {
        output(await api.get('/meta/countries/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('states <countryId>')
    .description('List states for a country')
    .action(async (countryId: string) => {
      try {
        output(await api.get(`/meta/countries/${countryId}/states/`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('timezones')
    .description('List all timezones')
    .action(async () => {
      try {
        output(await api.get('/meta/timezones/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('users')
    .description('List system users')
    .action(async () => {
      try {
        output(await api.get('/meta/users/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('integrations')
    .description('Get integration settings')
    .action(async () => {
      try {
        output(await api.get('/integrations/'));
      } catch (err) {
        handleError(err);
      }
    });
}
