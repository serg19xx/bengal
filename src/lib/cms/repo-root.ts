import path from 'node:path';

/** Project root when Node runs `astro dev` / adapter server (cwd is the repo). */
export function getRepoRoot(): string {
  return process.cwd();
}

export function getCatsContentDir(): string {
  return path.join(getRepoRoot(), 'src', 'content', 'cats');
}

export function getPublicCatsDir(): string {
  return path.join(getRepoRoot(), 'public', 'images', 'cats');
}
