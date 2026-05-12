import { Command } from 'commander';
import { api } from '../auth/client.js';
import { output } from '../utils/output.js';
import { handleError } from '../utils/errors.js';

export function registerRecruitingCommands(program: Command): void {
  const cmd = program.command('recruiting').description('Applicant tracking and recruiting');

  cmd
    .command('jobs')
    .description('List job summaries')
    .action(async () => {
      try {
        output(await api.get('/applicant_tracking/jobs'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create-job')
    .description('Create a job opening')
    .requiredOption('--data <json>', 'Job data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/applicant_tracking/jobs', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('applicants')
    .description('List job applications')
    .option('--job-id <id>', 'Filter by job ID')
    .action(async (opts) => {
      try {
        const query: Record<string, string> = {};
        if (opts.jobId) query.jobId = opts.jobId;
        output(await api.get('/applicant_tracking/applications', query));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('get-applicant <id>')
    .description('Get application details')
    .action(async (id: string) => {
      try {
        output(await api.get(`/applicant_tracking/applications/${id}`));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('add-comment <applicantId>')
    .description('Add a comment to an application')
    .requiredOption('--data <json>', 'Comment data as JSON')
    .action(async (applicantId: string, opts) => {
      try {
        output(await api.post(`/applicant_tracking/applications/${applicantId}/comments`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('statuses')
    .description('List applicant statuses')
    .action(async () => {
      try {
        output(await api.get('/applicant_tracking/statuses'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('update-status <applicantId>')
    .description('Update applicant status')
    .requiredOption('--data <json>', 'Status data as JSON')
    .action(async (applicantId: string, opts) => {
      try {
        output(await api.post(`/applicant_tracking/applications/${applicantId}/status`, JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('locations')
    .description('List company locations')
    .action(async () => {
      try {
        output(await api.get('/applicant_tracking/locations'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('hiring-leads')
    .description('List hiring leads')
    .action(async () => {
      try {
        output(await api.get('/applicant_tracking/hiring_leads'));
      } catch (err) {
        handleError(err);
      }
    });

  cmd
    .command('create-candidate')
    .description('Create a new candidate')
    .requiredOption('--data <json>', 'Candidate data as JSON')
    .action(async (opts) => {
      try {
        output(await api.post('/applicant_tracking/candidates', JSON.parse(opts.data)));
      } catch (err) {
        handleError(err);
      }
    });
}
