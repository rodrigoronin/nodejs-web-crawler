import { JSDOM } from 'jsdom';

export function normalizeURL(url) {
  const newUrl = new URL(url);
  const pathnameWithoutSlash = newUrl.pathname.split('/');
  let normalizedURL = `${newUrl.hostname}/${pathnameWithoutSlash.filter((path) => path !== '').join('/')}`;

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
    if (link.hostname) {
      if (normalizeURL(baseURL) !== normalizeURL(link)) {
        continue;
      } else {
        links.push(`${link.hostname}${link.href}`);
      }
    }
      
    if (link.href !== '/') {
      links.push(`${baseURL}${link.href.slice(1)}`);
    }
  }

  return links;
}

export async function crawlPage(baseURL, currentURL, pages = {}) {
  let linksList = []

  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL ?? baseURL);

  if (currentURLObj?.hostname !== baseURLObj.hostname) {
    return pages;
  }

  const normalizedURL = normalizeURL(currentURL ?? baseURL);

  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }

  pages[normalizedURL] = 1;

  console.log('Crawling on: ', currentURL ?? baseURL);

  try {
    await fetch(baseURL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/html',
      }
    })
    .then((res) => {
      const contentType = res.headers.get('content-type');

      if (!contentType.includes('text/html')) {
          throw new Error('Wrong content-type!');
      }
      
      if (res.status.toString().slice(0, 1) === '4') {
        console.log('Something went wrong! Try Again!');
        return pages;
      } else {
        return res.text();
      }
    })
    .then((html) => {
      linksList = getURLsFromHTML(html, baseURL);
    });
  } catch(err) {
    console.log(err.message);
  }

  for (const link of linksList) {
    pages = await crawlPage(baseURL, link, pages);
  }

  return pages;
}
