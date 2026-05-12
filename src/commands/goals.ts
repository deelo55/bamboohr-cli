import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerGoalsCommands(program: Command): void {
  const cmd = program.command('goals').description('Manage employee goals');

  cmd
    .command('list')
    .description('List goals')
    .option('--employee-id <id>', 'Filter by employee ID')
    .action(async (opts) => {
      try {
        const query: Record<string, string> = {};
        if (opts.employeeId) query.employeeId = opts.employeeId;
        output(await api.get('/performance/goals', query));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create')
    .description('Create a goal')
    .requiredOption('--data <json>', 'Goal data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/performance/goals', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update <goalId>')
    .description('Update a goal')
    .requiredOption('--data <json>', 'Goal data as JSON')
    .action(async (goalId: string, opts) => {
      try {
        output(await api.put(`/performance/goals/${goalId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('delete <goalId>')
    .description('Delete a goal')
    .action(async (goalId: string) => {
      try {
        output(await api.del(`/performance/goals/${goalId}`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('close <goalId>')
    .description('Close a goal')
    .action(async (goalId: string) => {
      try {
        output(await api.post(`/performance/goals/${goalId}/close`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('reopen <goalId>')
    .description('Reopen a goal')
    .action(async (goalId: string) => {
      try {
        output(await api.post(`/performance/goals/${goalId}/reopen`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('progress <goalId>')
    .description('Update goal progress')
    .requiredOption('--data <json>', 'Progress data as JSON')
    .action(async (goalId: string, opts) => {
      try {
        output(await api.put(`/performance/goals/${goalId}/progress`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('milestone-progress <goalId> <milestoneId>')
    .description('Update milestone progress')
    .requiredOption('--data <json>', 'Progress data as JSON')
    .action(async (goalId: string, milestoneId: string, opts) => {
      try {
        output(await api.put(`/performance/goals/${goalId}/milestones/${milestoneId}/progress`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('sharing <goalId>')
    .description('Update goal sharing')
    .requiredOption('--data <json>', 'Sharing data as JSON')
    .action(async (goalId: string, opts) => {
      try {
        output(await api.put(`/performance/goals/${goalId}/sharing`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('aggregate')
    .description('Get goals aggregate data')
    .option('--employee-id <id>', 'Filter by employee ID')
    .action(async (opts) => {
      try {
        const query: Record<string, string> = {};
        if (opts.employeeId) query.employeeId = opts.employeeId;
        output(await api.get('/performance/goals/aggregate', query));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('status-counts')
    .description('Get goal status counts')
    .action(async () => {
      try {
        output(await api.get('/performance/goals/status_counts'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('filters')
    .description('List goal filters')
    .action(async () => {
      try {
        output(await api.get('/performance/goals/filters'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('creation-permission')
    .description('Check goal creation permission')
    .action(async () => {
      try {
        output(await api.get('/performance/goals/creation_permission'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('sharing-options')
    .description('List goal sharing options')
    .action(async () => {
      try {
        output(await api.get('/performance/goals/sharing_options'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('alignable-options')
    .description('Get alignable goal options')
    .action(async () => {
      try {
        output(await api.get('/performance/goals/alignable_options'));
      } catch (err) {
        handleError(err);
      }
    });

  // Comments
  cmd
    .command('comments <goalId>')
    .description('List comments on a goal')
    .action(async (goalId: string) => {
      try {
        output(await api.get(`/performance/goals/${goalId}/comments`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('add-comment <goalId>')
    .description('Add a comment to a goal')
    .requiredOption('--data <json>', 'Comment data as JSON')
    .action(async (goalId: string, opts) => {
      try {
        output(await api.post(`/performance/goals/${goalId}/comments`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update-comment <goalId> <commentId>')
    .description('Update a goal comment')
    .requiredOption('--data <json>', 'Comment data as JSON')
    .action(async (goalId: string, commentId: string, opts) => {
      try {
        output(await api.put(`/performance/goals/${goalId}/comments/${commentId}`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('delete-comment <goalId> <commentId>')
    .description('Delete a goal comment')
    .action(async (goalId: string, commentId: string) => {
      try {
        output(await api.del(`/performance/goals/${goalId}/comments/${commentId}`));
      } catch (err) {
        handleError(err);
      }
    });
}
