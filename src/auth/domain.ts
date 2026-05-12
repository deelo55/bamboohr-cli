const DOMAIN_RE = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,62}$/;

export function assertValidDomain(domain: string): void {
  if (!DOMAIN_RE.test(domain)) {
    throw new Error(
      'Invalid --domain. Use only letters, digits, and hyphens (e.g. "acme"), no dots or other characters.',
    );
  }
}
