import { test, expect } from '@jest/globals';
import { normalizeURL, getURLsFromHTML } from './crawl';

describe('normalizeURL', () => {
  test('normalize http://blog.boot.dev/path/ url', () => {
    const result = normalizeURL('http://blog.boot.dev/path/');
    expect(result).toEqual('blog.boot.dev/path');
  });

  test('normalize http://blog.boot.dev/path/anotherpath url', () => {
    const result = normalizeURL('http://blog.boot.dev/path/anotherpath');
    expect(result).toEqual('blog.boot.dev/path/anotherpath');
  });

  test('normalize https://blog.boot.dev/path/ url', () => {
    const result = normalizeURL('https://blog.boot.dev/path/');
    expect(result).toBe('blog.boot.dev/path');
  });

  test('normalize https://wagslane.dev/path url', () => {
    const result = normalizeURL('https://wagslane.dev/path');
    expect(result).toBe('wagslane.dev/path');
  });

  test('normalize https://www.google.com url', () => {
    const result = normalizeURL('https://www.google.com');
    expect(result).toBe('www.google.com');
  });
});

describe('getURLsFromHTML', () => {
  const HTMLBodyLinks = `<body>
                          <a href="/path">Link 1</a>
                          <a href="/path/">Link 2</a>
                          <a href="/test/">Link 3</a>
                         </body>`

  const baseURL = 'http://blog.boot.dev';

  test('converts relative URLs into absolute', () => {
    const result = getURLsFromHTML(HTMLBodyLinks, baseURL);

    expect(result[2]).toBe('http://blog.boot.dev/test/');
  });

  test('find all <a> elements', () => {
    const result = getURLsFromHTML(HTMLBodyLinks, baseURL);

    expect(result.length).toBe(3);
  });
});
