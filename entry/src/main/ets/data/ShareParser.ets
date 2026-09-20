export class ParsedShare {
  url: string = '';
  title: string = '';
}

export function parseShareText(raw: string): ParsedShare {
  const result = new ParsedShare();
  const text = normalizeShareText(raw);
  const url = extractUrl(text);
  result.url = url;
  if (url.length > 0) {
    result.title = cleanShareTitle(text.split(url).join(' '));
  } else {
    result.title = cleanShareTitle(text);
  }
  return result;
}

function normalizeShareText(raw: string): string {
  return raw
    .replace(/\u200b/g, '')
    .replace(/https?：\/\//gi, 'https://')
    .replace(/http：\/\//gi, 'http://')
    .trim();
}

function extractUrl(text: string): string {
  const httpMatch = text.match(/https?:\/\/[^\s\u3000<>"'`|丨]+/i);
  if (httpMatch && httpMatch[0]) {
    return trimUrlTail(httpMatch[0]);
  }
  const wwwMatch = text.match(/www\.[^\s\u3000<>"'`|丨]+/i);
  if (wwwMatch && wwwMatch[0]) {
    return trimUrlTail('https://' + wwwMatch[0]);
  }
  return '';
}

function trimUrlTail(url: string): string {
  return url.replace(/[)\]}）。，,;；！!、]+$/g, '');
}

function cleanShareTitle(raw: string): string {
  let title = raw
    .replace(/[《》【】\[\]]/g, ' ')
    .replace(/复制(此)?(消息|链接|口令).*/g, ' ')
    .replace(/打开.*(腾讯视频|爱奇艺|优酷|芒果TV|哔哩哔哩|bilibili).*/gi, ' ')
    .replace(/我正在看/g, ' ')
    .replace(/分享自.*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (title.length < 2 || /^https?:\/\//i.test(title)) {
    return '';
  }
  return title;
}
