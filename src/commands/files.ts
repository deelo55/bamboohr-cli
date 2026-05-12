import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerFilesCommands(program: Command): void {
  const cmd = program.command('files').description('Manage company and employee files');

  // Company files
  const company = cmd.command('company').description('Company files');

  company
    .command('list')
    .description('List company files and categories')
    .action(async () => {
      try {
        output(await api.get('/files/'));
      } catch (err) {
        handleError(err);
      }
    });

  company
    .command('get <fileId>')
    .description('Get a company file')
    .action(async (fileId: string) => {
      try {
        output(await api.get(`/files/${fileId}`));
      } catch (err) {
        handleError(err);
      }
    });

  company
    .command('create-category')
    .description('Create a company file category')
    .requiredOption('--data <json>', 'Category data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/files/categories', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  company
    .command('update <fileId>')
    .description('Update company file metadata')
    .requiredOption('--data <json>', 'File metadata as JSON')
    .action(async (fileId: string, opts) => {
      try {
        output(await api.post(`/files/${fileId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  company
    .command('delete <fileId>')
    .description('Delete a company file')
    .action(async (fileId: string) => {
      try {
        output(await api.del(`/files/${fileId}`));
      } catch (err) {
        handleError(err);
      }
    });

  // Employee files
  const employee = cmd.command('employee').description('Employee files');

  employee
    .command('list <employeeId>')
    .description('List files for an employee')
    .action(async (employeeId: string) => {
      try {
        output(await api.get(`/employees/${employeeId}/files/`));
      } catch (err) {
        handleError(err);
      }
    });

  employee
    .command('get <employeeId> <fileId>')
    .description('Get an employee file')
    .action(async (employeeId: string, fileId: string) => {
      try {
        output(await api.get(`/employees/${employeeId}/files/${fileId}`));
      } catch (err) {
        handleError(err);
      }
    });

  employee
    .command('create-category <employeeId>')
    .description('Create a file category for an employee')
    .requiredOption('--data <json>', 'Category data as JSON')
    .action(async (employeeId: string, opts) => {
      try {
        output(await api.post(`/employees/${employeeId}/files/categories`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  employee
    .command('update <employeeId> <fileId>')
    .description('Update employee file metadata')
    .requiredOption('--data <json>', 'File metadata as JSON')
    .action(async (employeeId: string, fileId: string, opts) => {
      try {
        output(await api.post(`/employees/${employeeId}/files/${fileId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  employee
    .command('delete <employeeId> <fileId>')
    .description('Delete an employee file')
    .action(async (employeeId: string, fileId: string) => {
      try {
        output(await api.del(`/employees/${employeeId}/files/${fileId}`));
      } catch (err) {
        handleError(err);
      }
    });
}
