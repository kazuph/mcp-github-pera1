import { z } from 'zod';

export const WORKER_BASE_URL = 'https://pera1.kazu-san.workers.dev/';

export const GithubUrlSchema = z.object({
  url: z.string().url(),
  dir: z.string().optional(),
  ext: z.string().optional(),
  mode: z.enum(['tree']).optional(),
  branch: z.string().optional(),
  file: z.string().optional(),
});

export type GithubWorkerRequest = z.infer<typeof GithubUrlSchema>;

export const buildWorkerUrl = (params: GithubWorkerRequest): string => {
  const url = new URL(`${WORKER_BASE_URL}${params.url}`);

  if (params.dir) url.searchParams.set('dir', params.dir);
  if (params.ext) url.searchParams.set('ext', params.ext);
  if (params.mode) url.searchParams.set('mode', params.mode);
  if (params.branch) url.searchParams.set('branch', params.branch);
  if (params.file) url.searchParams.set('file', params.file);

  return url.toString();
};
