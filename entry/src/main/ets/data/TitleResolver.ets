import http from '@ohos.net.http';

const MAX_REDIRECTS = 5;
const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36';

class FetchResult {
  body: string = '';
  redirect: string = '';
}

interface RequestHeader {
  'User-Agent': string;
  'Accept': string;
  'Accept-Language': string;
}

export async function resolveVideoTitle(url: string): Promise<string> {
  let current = url.trim();
  if (!/^https?:\/\//i.test(current)) {
    return '';
  }
  for (let i = 0; i < MAX_REDIRECTS; i++) {
    const result = await fetchOnce(current);
    if (result.redirect.length > 0) {
      current = toAbsoluteUrl(current, result.redirect);
      continue;
    }
    return extractTitle(result.body);
  }
  return '';
}

async function fetchOnce(url: string): Promise<FetchResult> {
  const client = http.createHttp();
  const out = new FetchResult();
  try {
    const header: RequestHeader = {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    };
    const options: http.HttpRequestOptions = {
      method: http.RequestMethod.GET,
      readTimeout: 10000,
      connectTimeout: 8000,
      expectDataType: http.HttpDataType.STRING,
      usingCache: false,
      header: header
    };
    const response = await client.request(url, options);
    const code = response.responseCode;
    if (code === 301 || code === 302 || code === 303 || code === 307 || code === 308) {
      out.redirect = readHeader(response.header, 'location');
      return out;
    }
    if (typeof response.result === 'string') {
      out.body = response.result;
    }
    return out;
  } catch (error) {
    return out;
  } finally {
    client.destroy();
  }
}

function readHeader(header: Object, name: string): string {
  const map = header as Record<string, string | Array<string>>;
  const keys = Object.keys(map);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key.toLowerCase() === name.toLowerCase()) {
      const value = map[key];
      if (typeof value === 'string') {
        return value;
      }
      if (Array.isArray(value) && value.length > 0) {
        return value[0];
      }
    }
  }
  return '';
}

function toAbsoluteUrl(base: string, location: string): string {
  const value = location.trim();
  if (value.length === 0) {
    return base;
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  if (value.startsWith('//')) {
    return 'https:' + value;
  }
  const originMatch = base.match(/^(https?:\/\/[^/]+)/i);
  if (value.startsWith('/') && originMatch && originMatch[1]) {
    return originMatch[1] + value;
  }
  return value;
}

function extractTitle(html: string): string {
  if (html.length === 0) {
    return '';
  }
  const og = matchMetaContent(html, 'og:title');
  if (og.length > 0) {
    return cleanTitle(decodeHtml(og));
  }
  const twitter = matchMetaContent(html, 'twitter:title');
  if (twitter.length > 0) {
    return cleanTitle(decodeHtml(twitter));
  }
  const named = matchMetaContent(html, 'title');
  if (named.length > 0) {
    return cleanTitle(decodeHtml(named));
  }
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return cleanTitle(decodeHtml(titleMatch[1]));
  }
  return '';
}

function matchMetaContent(html: string, key: string): string {
  const escaped = key.replace('.', '\\.');
  const patternA =
    `<meta[^>]*(?:property|name)\\s*=\\s*["']${escaped}["'][^>]*content\\s*=\\s*["']([^"']+)["']`;
  const patternB =
    `<meta[^>]*content\\s*=\\s*["']([^"']+)["'][^>]*(?:property|name)\\s*=\\s*["']${escaped}["']`;
  const matchA = html.match(new RegExp(patternA, 'i'));
  if (matchA && matchA[1]) {
    return matchA[1];
  }
  const matchB = html.match(new RegExp(patternB, 'i'));
  if (matchB && matchB[1]) {
    return matchB[1];
  }
  return '';
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function cleanTitle(raw: string): string {
  let title = raw.replace(/\s+/g, ' ').trim();
  const suffixes: string[] = [
    '_哔哩哔哩_bilibili',
    ' - 哔哩哔哩',
    '_哔哩哔哩',
    ' - 腾讯视频',
    '_腾讯视频',
    ' - 爱奇艺',
    '_爱奇艺',
    ' - 优酷视频',
    ' - 优酷',
    '_优酷视频',
    '_优酷',
    ' - 芒果TV',
    '_芒果TV'
  ];
  for (let i = 0; i < suffixes.length; i++) {
    const suffix = suffixes[i];
    if (title.endsWith(suffix)) {
      title = title.substring(0, title.length - suffix.length).trim();
    }
  }
  const biliIndex = title.indexOf('_哔哩哔哩');
  if (biliIndex > 0) {
    title = title.substring(0, biliIndex).trim();
  }
  return title;
}
