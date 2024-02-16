import { watch } from 'fs';
import { build } from './build';

watch('src', async (event, filename) => {
  console.log(`Detected ${event} in ${filename}`);

  await build();
});
