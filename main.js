import * as readline from 'node:readline';
import { argv, stdin as input, stdout as output } from 'node:process';
import { crawlPage } from './crawl.js';
import { printReport } from './report.js';

async function main() {
  const rline = readline.createInterface({
    input,
    output,
  });

  console.log(process.argv.length)

  if (process.argv.length > 4) {
    console.log('Arguments exceeded the limit');
    rline.close();
    return;
  } else if (argv.length < 4) {
    console.log('No website to crawl');
    rline.close();
    return;
  }

  console.log('Starting crawler robot...');
  console.log('Scanning...', argv[2]);

  const pages = await crawlPage(argv[2], argv[3], {});

  printReport(pages);

  rline.close();
}

main();
