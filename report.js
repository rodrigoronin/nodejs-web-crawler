export function printReport(pages) {
  console.log('\nStarting to generate report...\n');

  const sortedPages = sortByNumberOfPagesFound(pages);

  sortedPages.forEach((value, key) => {
    console.log(`Found ${value} internal links for ${key}`);
  });
}

function sortByNumberOfPagesFound(pages) {
  const sortedPages = new Map();

  const sortedKeys = Object.keys(pages).sort((a, b) => pages[b] - pages[a]);

  sortedKeys.forEach(key => {
    sortedPages.set(key, pages[key]);
  });
    

  return sortedPages;
}
