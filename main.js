import * as readline from 'node:readline';
import { argv, stdin as input, stdout as output } from 'node:process';
import { crawlPage } from './crawl.js';
import { printReport } from './report.js';

async function main() {
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

  const pages = await crawlPage(argv[2]);

  printReport(pages);

  rline.close();
}

main();
