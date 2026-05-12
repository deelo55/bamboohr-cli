export class BambooError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseBody?: string,
  ) {
    super(message);
    this.name = 'BambooError';
  }
}

const SENSITIVE_KEYS = new Set([
  'access_token',
  'refresh_token',
  'client_secret',
  'code',
  'code_verifier',
  'authorization',
  'api_key',
  'apikey',
  'password',
]);

function redactObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactObject);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : redactObject(v);
    }
    return out;
  }
  return value;
}

export function redactErrorBody(body: string): string {
  if (!body) return body;
  // Try JSON first.
  try {
    const parsed = JSON.parse(body);
    return JSON.stringify(redactObject(parsed));
  } catch {
    // Fallback for form-encoded or plain text: redact known key=value pairs.
    return body.replace(
      /(access_token|refresh_token|client_secret|code_verifier|api[_-]?key|password)=([^&\s"]+)/gi,
      '$1=[REDACTED]',
    );
  }
}

const DEBUG = process.env.BAMBOO_DEBUG === '1' || process.env.BAMBOO_DEBUG === 'true';

export function handleError(err: unknown): never {
  if (err instanceof BambooError) {
    const output: Record<string, unknown> = { error: err.message };
    if (err.statusCode) output.statusCode = err.statusCode;
    if (err.responseBody) {
      const body = DEBUG ? err.responseBody : redactErrorBody(err.responseBody);
      try {
        output.details = JSON.parse(body);
      } catch {
        output.details = body;
      }
    }
    process.stderr.write(JSON.stringify(output, null, 2) + '\n');
  } else if (err instanceof Error) {
    process.stderr.write(JSON.stringify({ error: err.message }, null, 2) + '\n');
  } else {
    process.stderr.write(JSON.stringify({ error: String(err) }, null, 2) + '\n');
  }
  process.exit(1);
}
