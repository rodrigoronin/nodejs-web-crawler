const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const HTMLBodyLinks = `<body>
                        <a href="/path">Link 1</a>
                        <a href="/path/">Link 2</a>
                        <a href="/test/">Link 3</a>
                       </body>`

const baseURL = 'http://blog.boot.dev';


function normalizeURL(url) {
  const newUrl = new URL(url);
  const pathnameWithoutSlash = newUrl.pathname.split('/') ?? '';
  let normalizedURL = '';

  if (pathnameWithoutSlash === '') {
    normalizeURL = hostname;
  } else if (pathnameWithoutSlash.length > 2) {
    normalizedURL = `${newUrl.hostname}/${pathnameWithoutSlash[1]}`;
  } else {
    normalizedURL = `${newUrl.hostname}/${pathnameWithoutSlash.join('')}`;
  }

  return normalizedURL;
}

function getURLsFromHTML(HTMLBody, baseURL) {
  const dom = new JSDOM(HTMLBody);

  const linksList = dom.window.document.querySelectorAll('a');
  const links = [];

  for (let link of linksList) {
    links.push(`${baseURL}${link.href}`);
  }

  console.log(links);

  return links;
}

getURLsFromHTML(HTMLBodyLinks, 'http://blog.boot.dev');
//console.log(normalizeURL('http://blog.boot.dev/path/test'));
//console.log(normalizeURL('http://blog.boot.dev/path/test'));
//console.log(normalizeURL('http://blog.boot.dev'));

module.exports = {
  normalizeURL,
  getURLsFromHTML
}
