import { JSDOM } from 'jsdom';

function normalizeURL(url){
  const urlObj = new URL(url)
  let fullPath = `${urlObj.host}${urlObj.pathname}`
  if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
    fullPath = fullPath.slice(0, -1)
  }
  return fullPath
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

export async function crawlPage(baseURL, currentURL, pages){
  const currentUrlObj = new URL(currentURL ?? baseURL)
  const baseUrlObj = new URL(baseURL)
  if (currentUrlObj.hostname !== baseUrlObj.hostname){
    return pages
  }

  const normalizedURL = normalizeURL(currentURL ?? baseURL)

  if (pages[normalizedURL] > 0){
    pages[normalizedURL]++
    return pages
  }

  pages[normalizedURL] = 1

  console.log(`crawling ${currentURL}`)
  let htmlBody = ''
  try {
    const resp = await fetch(currentURL)
    if (resp.status > 399){
      console.log(`Got HTTP error, status code: ${resp.status}`)
      return pages
    }
    const contentType = resp.headers.get('content-type')
    if (!contentType.includes('text/html')){
      console.log(`Got non-html response: ${contentType}`)
      return pages
    }
    htmlBody = await resp.text()
  } catch (err){
    console.log(err.message)
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseURL)
  for (const nextURL of nextURLs){
    pages = await crawlPage(baseURL, nextURL, pages)
  }

  return pages
}
