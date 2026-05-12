import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerTimeTrackingCommands(program: Command): void {
  const cmd = program.command('time-tracking').description('Manage time tracking and timesheets');

  cmd
    .command('entries')
    .description('List timesheet entries')
    .requiredOption('--start <date>', 'Start date (YYYY-MM-DD)')
    .requiredOption('--end <date>', 'End date (YYYY-MM-DD)')
    .option('--employee-ids <ids>', 'Comma-separated employee IDs')
    .action(async (opts) => {
      try {
        const query: Record<string, string> = { start: opts.start, end: opts.end };
        if (opts.employeeIds) query.employeeIds = opts.employeeIds;
        output(await api.get('/timesheet/entries', query));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('clock-in')
    .description('Clock in an employee')
    .requiredOption('--data <json>', 'Clock-in data as JSON (employeeId, start, etc.)')
    .action(async (opts) => {
      try {
        output(await api.post('/timesheet/clock_in', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('clock-out')
    .description('Clock out an employee')
    .requiredOption('--data <json>', 'Clock-out data as JSON (employeeId, end, etc.)')
    .action(async (opts) => {
      try {
        output(await api.post('/timesheet/clock_out', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('clock-entries')
    .description('Create or update clock entries')
    .requiredOption('--data <json>', 'Clock entries data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/timesheet/clock_entries', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('hour-entries')
    .description('Create or update hour entries')
    .requiredOption('--data <json>', 'Hour entries data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/timesheet/hour_entries', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('delete-clock-entries')
    .description('Delete clock entries')
    .requiredOption('--data <json>', 'Entry IDs to delete as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/timesheet/clock_entries/delete', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('delete-hour-entries')
    .description('Delete hour entries')
    .requiredOption('--data <json>', 'Entry IDs to delete as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/timesheet/hour_entries/delete', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create-project')
    .description('Create a time tracking project')
    .requiredOption('--data <json>', 'Project data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/time_tracking/projects', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  // Break policies
  const breaks = cmd.command('breaks').description('Manage meal & rest break policies');

  breaks
    .command('list-policies')
    .description('List break policies')
    .action(async () => {
      try {
        output(await api.get('/time_tracking/break_policies'));
      } catch (err) {
        handleError(err);
      }
    });

  breaks
    .command('get-policy <id>')
    .description('Get break policy details')
    .action(async (id: string) => {
      try {
        output(await api.get(`/time_tracking/break_policies/${id}`));
      } catch (err) {
        handleError(err);
      }
    });

  breaks
    .command('create-policy')
    .description('Create a break policy')
    .requiredOption('--data <json>', 'Break policy data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/time_tracking/break_policies', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  breaks
    .command('update-policy <id>')
    .description('Update a break policy')
    .requiredOption('--data <json>', 'Break policy data as JSON')
    .action(async (id: string, opts) => {
      try {
        output(await api.patch(`/time_tracking/break_policies/${id}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  breaks
    .command('delete-policy <id>')
    .description('Delete a break policy')
    .action(async (id: string) => {
      try {
        output(await api.del(`/time_tracking/break_policies/${id}`));
      } catch (err) {
        handleError(err);
      }
    });

  breaks
    .command('list-breaks <policyId>')
    .description('List breaks in a policy')
    .action(async (policyId: string) => {
      try {
        output(await api.get(`/time_tracking/break_policies/${policyId}/breaks`));
      } catch (err) {
        handleError(err);
      }
    });

  breaks
    .command('create-break')
    .description('Create a break')
    .requiredOption('--data <json>', 'Break data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/time_tracking/breaks', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  breaks
    .command('policy-employees <policyId>')
    .description('List employees assigned to a break policy')
    .action(async (policyId: string) => {
      try {
        output(await api.get(`/time_tracking/break_policies/${policyId}/employees`));
      } catch (err) {
        handleError(err);
      }
    });

  breaks
    .command('employee-policies <employeeId>')
    .description('List break policies for an employee')
    .action(async (employeeId: string) => {
      try {
        output(await api.get(`/employees/${employeeId}/time_tracking/break_policies`));
      } catch (err) {
        handleError(err);
      }
    });

  breaks
    .command('employee-availabilities <employeeId>')
    .description('List break availabilities for an employee')
    .action(async (employeeId: string) => {
      try {
        output(await api.get(`/employees/${employeeId}/time_tracking/break_availabilities`));
      } catch (err) {
        handleError(err);
      }
    });

  breaks
    .command('assessments')
    .description('List break assessments')
    .action(async () => {
      try {
        output(await api.get('/time_tracking/break_assessments'));
      } catch (err) {
        handleError(err);
      }
    });
}
