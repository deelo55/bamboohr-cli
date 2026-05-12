import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerTrainingCommands(program: Command): void {
  const cmd = program.command('training').description('Manage training types, categories, and records');

  // Types
  cmd
    .command('list-types')
    .description('List training types')
    .action(async () => {
      try {
        output(await api.get('/training/type'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create-type')
    .description('Create a training type')
    .requiredOption('--data <json>', 'Training type data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/training/type', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update-type <typeId>')
    .description('Update a training type')
    .requiredOption('--data <json>', 'Training type data as JSON')
    .action(async (typeId: string, opts) => {
      try {
        output(await api.put(`/training/type/${typeId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('delete-type <typeId>')
    .description('Delete a training type')
    .action(async (typeId: string) => {
      try {
        output(await api.del(`/training/type/${typeId}`));
      } catch (err) {
        handleError(err);
      }
    });

  // Categories
  cmd
    .command('list-categories')
    .description('List training categories')
    .action(async () => {
      try {
        output(await api.get('/training/category'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create-category')
    .description('Create a training category')
    .requiredOption('--data <json>', 'Category data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/training/category', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update-category <categoryId>')
    .description('Update a training category')
    .requiredOption('--data <json>', 'Category data as JSON')
    .action(async (categoryId: string, opts) => {
      try {
        output(await api.put(`/training/category/${categoryId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('delete-category <categoryId>')
    .description('Delete a training category')
    .action(async (categoryId: string) => {
      try {
        output(await api.del(`/training/category/${categoryId}`));
      } catch (err) {
        handleError(err);
      }
    });

  // Employee training records
  cmd
    .command('list <employeeId>')
    .description('List training records for an employee')
    .action(async (employeeId: string) => {
      try {
        output(await api.get(`/employees/${employeeId}/training`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create <employeeId>')
    .description('Create a training record for an employee')
    .requiredOption('--data <json>', 'Training record data as JSON')
    .action(async (employeeId: string, opts) => {
      try {
        output(await api.post(`/employees/${employeeId}/training`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update <employeeId> <trainingId>')
    .description('Update a training record')
    .requiredOption('--data <json>', 'Training record data as JSON')
    .action(async (employeeId: string, trainingId: string, opts) => {
      try {
        output(await api.put(`/employees/${employeeId}/training/${trainingId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('delete <employeeId> <trainingId>')
    .description('Delete a training record')
    .action(async (employeeId: string, trainingId: string) => {
      try {
        output(await api.del(`/employees/${employeeId}/training/${trainingId}`));
      } catch (err) {
        handleError(err);
      }
    });
}
