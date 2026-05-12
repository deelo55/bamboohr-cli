---
name: bamboohr
description: Query and update BambooHR data (employees, time off, compensation, reports, custom fields) using the `bamboo` CLI. Use whenever the user asks about people in the company, HR data, time off / who's out, salaries, hiring history, org structure, training, benefits, or anything that lives in BambooHR.
---

# BambooHR

You have access to a `bamboo` CLI that talks to the BambooHR API. Every command emits JSON to stdout, so pipe results into `node -e` or `jq` to filter and aggregate.

## Before you start

Check authentication first:

```bash
bamboo status
```

If unauthenticated, ask the user which method to use:
- `bamboo login --domain <subdomain> --api-key <key>` (or via `BAMBOOHR_DOMAIN` / `BAMBOOHR_API_KEY`)
- `bamboo login-oauth --domain <subdomain> --client-id <id> --client-secret <secret>` (or env vars). This opens a browser for authorization.

Never invent credentials. If the user has not provided them, ask.

## Core workflows

### Find an employee by name or email

The directory is the only listing endpoint — there is no search. Pull the directory and filter in JS:

```bash
bamboo employees directory | node -e "
const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
const emps = d.employees || d;
const q = 'NAME OR EMAIL'.toLowerCase();
console.log(JSON.stringify(emps.filter(e =>
  (e.displayName||'').toLowerCase().includes(q) ||
  (e.workEmail||'').toLowerCase().includes(q)
), null, 2));
"
```

Common ambiguity: surnames like `D'souza` can match multiple people (e.g. Dwayne and Mike). Always verify the full name, email, or ID before reporting results.

### Get an employee's details

`bamboo employees get <id>` returns only 8 default fields. To get more, pass `--fields` with a comma-separated list:

```bash
bamboo employees get 113 --fields "firstName,lastName,payRate,payType,hireDate,customHiringManager"
```

To discover field names (including custom fields like `customHiringManager`, `customHiringTalentPartner1`, etc.):

```bash
bamboo meta fields
```

There are typically hundreds of custom fields. Filter the metadata output to find what you need.

### Salary / compensation

Salary is in the `compensation` table or via specific fields:

```bash
# Via fields
bamboo employees get <id> --fields "payRate,payType,payPer,payRateEffectiveDate"

# Or via the compensation table (history of changes)
bamboo tables get <id> compensation
```

Requires the `employee:compensation` scope if using OAuth (see Scopes section below).

### Time off

```bash
bamboo time-off whos-out --start 2026-05-12 --end 2026-12-31
bamboo time-off requests --employee-id <id> --start <date> --end <date>
bamboo time-off balance <id>
```

`whos-out` returns confirmed/approved time off only. If `requests` returns an empty array for a future range, the person genuinely has nothing booked — don't infer otherwise.

### Custom reports

For data that spans many fields or filters across the whole company, use custom reports instead of iterating the directory:

```bash
bamboo reports custom --fields "firstName,lastName,department,hireDate,customHiringManager" --title "Hiring history"
```

The output is `{ employees: { "<id>": { ... } } }`. Convert to an array with `Object.values()`.

### Hiring manager / who hired whom

The hiring manager is in `customHiringManager` (a string, not an ID). Pull a report including that field and filter:

```bash
bamboo reports custom --fields "firstName,lastName,jobTitle,department,hireDate,customHiringManager,status" --title "Hires" | node -e "
const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
const target = 'EXACT NAME';
const hires = Object.values(d.employees).filter(e => e.customHiringManager === target);
console.log(hires.length, 'hires');
hires.forEach(e => console.log(e.hireDate, e.firstName, e.lastName, '-', e.jobTitle));
"
```

**Watch out for partial-name matching.** `(s||'').includes('d\\'souza')` will match both "Dwayne D'Souza" and "Mike D'Souza". Prefer exact equality on the full name when filtering hiring manager fields.

### Org structure / reporting lines

The `supervisor` field on each directory entry is the manager's display name (string). To count direct reports:

```bash
bamboo employees directory | node -e "
const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
const emps = d.employees || d;
const target = 'EXACT MANAGER NAME';
const directs = emps.filter(e => e.supervisor === target);
console.log('Direct reports:', directs.length);
"
```

For transitive reports (whole org under someone), recurse over `supervisor === <name>` until no new employees are found.

## Output and error handling

- All commands print JSON. Pipe through `node -e` or `jq` for filtering. Don't rely on regex over the human-readable output.
- Errors print a JSON object with an `error` field to stderr and exit non-zero.
- 401 errors on OAuth will trigger an auto-refresh if a refresh token is stored; otherwise the user must re-login.

## Things to avoid

- **Don't guess employee IDs.** Always look them up via the directory first.
- **Don't query `/employees/directory` if you only need one person's basic info** — it returns the entire company. Use `employees get <id>` once you have the ID.
- **Don't assume scopes.** OAuth tokens are scoped to what the developer-portal app has enabled. If a request returns 401 on a specific endpoint (e.g. `/employees/directory` works but compensation fails), the corresponding scope is missing from the app — the user must enable it in the developer portal and re-run `login-oauth`. The CLI itself already requests every available scope.
- **Don't try to write data without explicit user confirmation.** `create`, `update`, `delete`, `clock-in/out`, `adjust-balance` etc. mutate live HR records.

## OAuth scopes (full list)

The CLI requests every scope BambooHR offers. The app in the developer portal must have these enabled, or BambooHR returns `invalid_scope` at login. There are no other scopes (no `offline_access`, no wildcards).

**Employee group:** `employee`, `employee:assets`, `employee:compensation`, `employee:contact`, `employee:custom_fields`, `employee:custom_fields_encrypted`, `employee:demographic`, `employee:dependent`, `employee:dependent:ssn`, `employee:education`, `employee:emergency_contacts`, `employee:file`, `employee:identification`, `employee:job`, `employee:management`, `employee:name`, `employee:payroll`, `employee:photo`, `employee:providers`, `employee:providers:payroll`, `employee_directory`, `employee_verifications`, `esignature`, `goal`, `onboarding`, `performance:assessments`, `performance:feedback`, `performance:one_on_ones`

**Reports group:** `report`

**Time Off group:** `time_off`

**OIDC basics:** `openid`, `email`

Mapping: if a command 401s, infer the scope from the endpoint it hits — `tables get <id> compensation` needs `employee:compensation`; `time-off whos-out` needs `time_off`; `reports custom` needs `report`; `employees directory` needs `employee_directory`. Tell the user to enable the missing scope in the developer portal and re-run `login-oauth`.

## Discovery

When unsure which fields, tables, or endpoints exist, ask the CLI:

```bash
bamboo --help
bamboo <group> --help
bamboo meta fields            # all employee fields including custom
bamboo meta tabular-fields    # all table names
bamboo datasets list          # all queryable datasets
```
