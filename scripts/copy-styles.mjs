// tsc emits JS and declarations but ignores CSS, so the stylesheets are
// copied across after it runs. Kept as a script rather than a shell `cp`
// so the build works the same on every platform.
import { cp, mkdir } from 'node:fs/promises';

await mkdir('dist/styles', { recursive: true });
await cp('src/styles', 'dist/styles', { recursive: true });
console.log('copied src/styles -> dist/styles');
