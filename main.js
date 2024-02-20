import * as readline from 'node:readline';
import { argv, stdin as input, stdout as output } from 'node:process';

function main() {
  const rline = readline.createInterface({
    input,
    output,
  });

  console.log(argv);

  if (argv.length > 1 || argv.length < 1) {
    console.log('Arguments exceeded the limit');
    rline.close();
  }
}

main();
