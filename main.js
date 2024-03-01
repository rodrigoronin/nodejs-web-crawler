import * as readline from 'node:readline';
import { argv, stdin as input, stdout as output } from 'node:process';
import { crawlPage } from './crawl.js';

function main() {
  const rline = readline.createInterface({
    input,
    output,
  });

  if (argv.length > 3 || argv.length < 3) {
    console.log('Arguments exceeded the limit');
    rline.close();
    return;
  }

  console.log('Starting crawler robot...');
  console.log('Scanning...', argv[2]);

  crawlPage(argv[2], null, []);
  rline.close();
}

main();
