import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerTimeOffCommands(program: Command): void {
  const cmd = program.command('time-off').description('Manage time off');

  cmd
    .command('requests')
    .description('List time off requests')
    .option('--start <date>', 'Start date (YYYY-MM-DD)')
    .option('--end <date>', 'End date (YYYY-MM-DD)')
    .option('--employee-id <id>', 'Filter by employee ID')
    .option('--status <status>', 'Filter by status')
    .action(async (opts) => {
      try {
        const query: Record<string, string> = {};
        if (opts.start) query.start = opts.start;
        if (opts.end) query.end = opts.end;
        if (opts.employeeId) query.employeeId = opts.employeeId;
        if (opts.status) query.status = opts.status;
        output(await api.get('/time_off/requests/', query));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create-request')
    .description('Create a time off request')
    .requiredOption('--employee-id <id>', 'Employee ID')
    .requiredOption('--data <json>', 'Request data as JSON (status, start, end, timeOffTypeId, amount, notes)')
    .action(async (opts) => {
      try {
        output(await api.put('/time_off/requests/', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update-request <id>')
    .description('Update a time off request status')
    .requiredOption('--status <status>', 'New status (approved, denied, cancelled)')
    .option('--note <note>', 'Optional note')
    .action(async (id: string, opts) => {
      try {
        const body: Record<string, string> = { status: opts.status };
        if (opts.note) body.note = opts.note;
        output(await api.put(`/time_off/requests/${id}`, body));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('types')
    .description('List time off types')
    .action(async () => {
      try {
        output(await api.get('/meta/time_off/types/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('policies')
    .description('List time off policies')
    .action(async () => {
      try {
        output(await api.get('/meta/time_off/policies/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('employee-policies <employeeId>')
    .description('List time off policies for an employee')
    .action(async (employeeId: string) => {
      try {
        output(await api.get(`/employees/${employeeId}/time_off/policies/`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('assign-policies <employeeId>')
    .description('Assign time off policies to an employee')
    .requiredOption('--data <json>', 'Policy assignment data as JSON')
    .action(async (employeeId: string, opts) => {
      try {
        output(await api.put(`/employees/${employeeId}/time_off/policies/`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('balance <employeeId>')
    .description('Get time off balance for an employee')
    .option('--end <date>', 'Balance as of date (YYYY-MM-DD)')
    .action(async (employeeId: string, opts) => {
      try {
        const query: Record<string, string> = {};
        if (opts.end) query.end = opts.end;
        output(await api.get(`/employees/${employeeId}/time_off/balance/`, query));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('adjust-balance <employeeId>')
    .description('Adjust time off balance for an employee')
    .requiredOption('--data <json>', 'Balance adjustment data as JSON')
    .action(async (employeeId: string, opts) => {
      try {
        output(await api.put(`/employees/${employeeId}/time_off/balance/`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('history <employeeId>')
    .description('Create a time off history entry')
    .requiredOption('--data <json>', 'History entry data as JSON')
    .action(async (employeeId: string, opts) => {
      try {
        output(await api.put(`/employees/${employeeId}/time_off/history/`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('whos-out')
    .description('List who is currently out')
    .option('--start <date>', 'Start date (YYYY-MM-DD)')
    .option('--end <date>', 'End date (YYYY-MM-DD)')
    .action(async (opts) => {
      try {
        const query: Record<string, string> = {};
        if (opts.start) query.start = opts.start;
        if (opts.end) query.end = opts.end;
        output(await api.get('/time_off/whos_out/', query));
      } catch (err) {
        handleError(err);
      }
    });
}
