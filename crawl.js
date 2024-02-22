import { JSDOM } from 'jsdom';

const HTMLBodyLinks = `<body>
                        <a href="/path">Link 1</a>
                        <a href="/path/">Link 2</a>
                        <a href="/test/">Link 3</a>
                       </body>`

const baseURL = 'http://blog.boot.dev';


export function normalizeURL(url) {
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

export function getURLsFromHTML(HTMLBody, baseURL) {
  const dom = new JSDOM(HTMLBody);

  const linksList = dom.window.document.querySelectorAll('a');
  const links = [];

  for (let link of linksList) {
    links.push(`${baseURL}${link.href}`);
  }

  console.log(links);

  return links;
}

export async function crawlPage(baseURL) {
  try {
    await fetch(baseURL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/html',
      }
    })
    .then((res) => {
      for (let key of res.headers) {
        if (key[0] === 'content-type' && key[1].split(';').shift() !== 'text/html') {
          throw new Error('Wrong content-type!');
        }
      }
      
      if (res.status === 404) {
        throw new Error('Something went wrong! Try Again!');
      } else {
        return res.text();
      }
    })
    .then((html) => {
      console.log(html);
    });
  } catch(err) {
    console.log(err.message);
  }
}
