import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerTablesCommands(program: Command): void {
  const cmd = program.command('tables').description('Manage employee tabular data');

  cmd
    .command('get <employeeId> <tableName>')
    .description('Get table data for an employee')
    .action(async (employeeId: string, tableName: string) => {
      try {
        output(await api.get(`/employees/${employeeId}/tables/${tableName}`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create <employeeId> <tableName>')
    .description('Add a row to an employee table')
    .requiredOption('--data <json>', 'Row data as JSON')
    .action(async (employeeId: string, tableName: string, opts) => {
      try {
        output(await api.post(`/employees/${employeeId}/tables/${tableName}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update <employeeId> <tableName> <rowId>')
    .description('Update a row in an employee table')
    .requiredOption('--data <json>', 'Row data as JSON')
    .action(async (employeeId: string, tableName: string, rowId: string, opts) => {
      try {
        output(await api.post(`/employees/${employeeId}/tables/${tableName}/${rowId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('delete <employeeId> <tableName> <rowId>')
    .description('Delete a row from an employee table')
    .action(async (employeeId: string, tableName: string, rowId: string) => {
      try {
        output(await api.del(`/employees/${employeeId}/tables/${tableName}/${rowId}`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('changed <employeeId> <tableName>')
    .description('Get changed table data since a date')
    .requiredOption('--since <date>', 'ISO date string')
    .action(async (employeeId: string, tableName: string, opts) => {
      try {
        output(await api.get(`/employees/${employeeId}/tables/${tableName}/changed`, { since: opts.since }));
      } catch (err) {
        handleError(err);
      }
    });
}
