import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerBenefitsCommands(program: Command): void {
  const cmd = program.command('benefits').description('Manage benefits, coverages, and dependents');

  cmd
    .command('list')
    .description('List company benefits')
    .action(async () => {
      try {
        output(await api.get('/benefits/'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('coverages')
    .description('List benefit coverages')
    .action(async () => {
      try {
        output(await api.get('/benefits/coverages'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('deduction-types')
    .description('List benefit deduction types')
    .action(async () => {
      try {
        output(await api.get('/benefits/deduction_types'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('employee <employeeId>')
    .description('Get benefits for an employee')
    .action(async (employeeId: string) => {
      try {
        output(await api.get(`/employees/${employeeId}/benefits`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('member <memberId>')
    .description('Get benefits for a member')
    .action(async (memberId: string) => {
      try {
        output(await api.get(`/members/${memberId}/benefits`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('member-events <memberId>')
    .description('List benefit events for a member')
    .action(async (memberId: string) => {
      try {
        output(await api.get(`/members/${memberId}/benefit_events`));
      } catch (err) {
        handleError(err);
      }
    });

  // Dependents
  cmd
    .command('dependents <employeeId>')
    .description('List dependents for an employee')
    .action(async (employeeId: string) => {
      try {
        output(await api.get(`/employees/${employeeId}/dependents`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('get-dependent <employeeId> <dependentId>')
    .description('Get a specific dependent')
    .action(async (employeeId: string, dependentId: string) => {
      try {
        output(await api.get(`/employees/${employeeId}/dependents/${dependentId}`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create-dependent <employeeId>')
    .description('Create a dependent')
    .requiredOption('--data <json>', 'Dependent data as JSON')
    .action(async (employeeId: string, opts) => {
      try {
        output(await api.post(`/employees/${employeeId}/dependents`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update-dependent <employeeId> <dependentId>')
    .description('Update a dependent')
    .requiredOption('--data <json>', 'Dependent data as JSON')
    .action(async (employeeId: string, dependentId: string, opts) => {
      try {
        output(await api.put(`/employees/${employeeId}/dependents/${dependentId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });
}
