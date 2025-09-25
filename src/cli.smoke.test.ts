import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import path from 'node:path';

describe('CLI starts', () => {
  it('prints startup banner from dist/index.js', async () => {
    const entry = path.join(__dirname, '..', 'dist', 'index.js');
    const child = spawn(process.execPath, [entry], {
      stdio: ['ignore', 'ignore', 'pipe'],
      env: { ...process.env },
    });

    const expected = 'MCP GitHub Pera1 Server running on stdio';

    await new Promise<void>((resolve, reject) => {
      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) {
          try { child.kill('SIGKILL'); } catch {}
          reject(new Error('CLI did not print startup banner in time'));
        }
      }, 5000);

      child.stderr.on('data', (buf: Buffer) => {
        const s = buf.toString();
        if (s.includes(expected)) {
          resolved = true;
          clearTimeout(timer);
          try { child.kill('SIGKILL'); } catch {}
          resolve();
        }
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });

    expect(true).toBe(true);
  });
});

