export function output(data: unknown): void {
  if (data === undefined || data === null) {
    process.stdout.write(JSON.stringify({ ok: true }) + '\n');
  } else if (typeof data === 'string') {
    // Could be XML or other non-JSON response
    process.stdout.write(data + '\n');
  } else {
    process.stdout.write(JSON.stringify(data, null, 2) + '\n');
  }
}
