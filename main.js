import * as readline from 'node:readline';
import { argv, stdin as input, stdout as output } from 'node:process';

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

  console.log(argv[2]);
  rline.close();
}

main();
