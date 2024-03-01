import { JSDOM } from 'jsdom';

const HTMLBodyLinks = `<body>
                        <a href="/path">Link 1</a>
                        <a href="/path/">Link 2</a>
                        <a href="/test/">Link 3</a>
                       </body>`

const baseURL = 'http://blog.boot.dev';


export function normalizeURL(url) {
  const newUrl = new URL(url);
  const pathnameWithoutSlash = newUrl.pathname.split('/');
  let normalizedURL = `${newUrl.hostname}${pathnameWithoutSlash.join('/')}`;

  if (normalizedURL.slice(-1) === '/') {
    return normalizedURL.slice(0, -1);
  } else {
    return normalizedURL;
  }
}

export function getURLsFromHTML(HTMLBody, baseURL) {
  const dom = new JSDOM(HTMLBody);

  const linksList = dom.window.document.querySelectorAll('a');
  const links = [];

  for (let link of linksList) {
    console.log('links ', link.href);
    if (link.href !== '/') {
      links.push(`${baseURL}${link.href}`);
    }
  }


  return links;
}

export async function crawlPage(baseURL, currentURL, pages) {
  if (!pages.hasOwnProperty('count')) {
    currentURL = baseURL;
  }

  if (normalizeURL(baseURL) !== normalizeURL(currentURL)) {
    return;
  }

  try {
    await fetch(currentURL, {
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
      //const allLinks = getURLsFromHTML(html, baseURL);
    });
  } catch(err) {
    console.log(err.message);
  }
}
