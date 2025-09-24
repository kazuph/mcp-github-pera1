import { describe, expect, it } from 'vitest';
import { buildWorkerUrl, WORKER_BASE_URL } from './githubTool.js';

describe('buildWorkerUrl', () => {
  it('constructs a worker request URL with query parameters', () => {
    const workerUrl = buildWorkerUrl({
      url: 'https://github.com/example/repo',
      dir: 'src/lib',
      ext: 'ts,tsx',
      mode: 'tree',
      branch: 'develop',
      file: 'src/lib/index.ts',
    });

    const parsed = new URL(workerUrl);
    expect(parsed.origin + parsed.pathname).toBe(
      `${WORKER_BASE_URL}https://github.com/example/repo`
    );
    expect(parsed.searchParams.get('dir')).toBe('src/lib');
    expect(parsed.searchParams.get('ext')).toBe('ts,tsx');
    expect(parsed.searchParams.get('mode')).toBe('tree');
    expect(parsed.searchParams.get('branch')).toBe('develop');
    expect(parsed.searchParams.get('file')).toBe('src/lib/index.ts');
  });
});

const shouldSkipIntegration = process.env.SKIP_WORKER_INTEGRATION === '1';

(shouldSkipIntegration ? it.skip : it)(
  'fetches repository metadata from the production worker',
  async () => {
    const requestUrl = buildWorkerUrl({
      url: 'https://github.com/kazuph/mcp-github-pera1',
      mode: 'tree',
    });

    const response = await fetch(requestUrl);
    expect(response.status).toBe(200);

    const text = await response.text();
    expect(text).toContain('# Directory Structure');
    expect(text).toContain('📂 src');
  }
);
