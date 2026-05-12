import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerEmployeesCommands(program: Command): void {
  const cmd = program.command('employees').description('Manage employees');

  cmd
    .command('directory')
    .description('Get employee directory')
    .action(async () => {
      try {
        output(await api.get('/employees/directory'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('list')
    .description('List all employees (returns IDs; use "get" for details)')
    .action(async () => {
      try {
        // BambooHR doesn't have a simple list-all endpoint with details,
        // the directory is the closest thing
        output(await api.get('/employees/directory'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('get <id>')
    .description('Get employee by ID')
    .option('--fields <fields>', 'Comma-separated field names', 'firstName,lastName,department,jobTitle,workEmail,workPhone,location,status')
    .action(async (id: string, opts) => {
      try {
        output(await api.get(`/employees/${id}`, { fields: opts.fields }));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create')
    .description('Create a new employee')
    .requiredOption('--first-name <name>', 'First name')
    .requiredOption('--last-name <name>', 'Last name')
    .option('--data <json>', 'Additional employee data as JSON')
    .action(async (opts) => {
      try {
        const body: Record<string, unknown> = {
          firstName: opts.firstName,
          lastName: opts.lastName,
        };
        if (opts.data) Object.assign(body, JSON.parse(opts.data));
        output(await api.post('/employees', body));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update <id>')
    .description('Update an employee')
    .requiredOption('--data <json>', 'Employee data as JSON')
    .action(async (id: string, opts) => {
      try {
        output(await api.post(`/employees/${id}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('changed')
    .description('Get list of employees whose data has changed since a date')
    .requiredOption('--since <date>', 'ISO date string (e.g. 2024-01-01T00:00:00Z)')
    .option('--type <type>', 'Type of changes: inserted, updated, deleted')
    .action(async (opts) => {
      try {
        const query: Record<string, string> = { since: opts.since };
        if (opts.type) query.type = opts.type;
        output(await api.get('/employees/changed', query));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('photo <id>')
    .description('Get employee photo URL')
    .action(async (id: string) => {
      try {
        output(await api.get(`/employees/${id}/photo`));
      } catch (err) {
        handleError(err);
      }
    });
}
