import http from "@ohos:net.http";
const MAX_REDIRECTS = 5;
const USER_AGENT = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36';
class FetchResult {
    body: string = '';
    redirect: string = '';
}
export class VideoMeta {
    title: string = '';
    coverUrl: string = '';
    durationSeconds: number = 0;
    progressSeconds: number = 0;
}
interface RequestHeader {
    'User-Agent': string;
    'Accept': string;
    'Accept-Language': string;
}
export async function resolveRedirectedUrl(url: string): Promise<string> {
    let current = url.trim();
    if (!/^https?:\/\//i.test(current)) {
        return current;
    }
    for (let i = 0; i < MAX_REDIRECTS; i++) {
        const result = await fetchOnce(current);
        if (result.redirect.length > 0) {
            current = toAbsoluteUrl(current, result.redirect);
            continue;
        }
        return current;
    }
    return current;
}
export async function resolveVideoTitle(url: string): Promise<string> {
    const meta = await resolveVideoMeta(url);
    return meta.title;
}
export async function resolveVideoMeta(url: string): Promise<VideoMeta> {
    const meta = new VideoMeta();
    meta.progressSeconds = extractProgressFromUrl(url);
    const bili = await tryBilibiliApi(url);
    if (bili.title.length > 0 || bili.coverUrl.length > 0) {
        return bili;
    }
    let current = url.trim();
    if (!/^https?:\/\//i.test(current)) {
        return meta;
    }
    for (let i = 0; i < MAX_REDIRECTS; i++) {
        const result = await fetchOnce(current);
        if (result.redirect.length > 0) {
            current = toAbsoluteUrl(current, result.redirect);
            if (meta.progressSeconds === 0) {
                meta.progressSeconds = extractProgressFromUrl(current);
            }
            continue;
        }
        fillMetaFromHtml(meta, result.body, current);
        if (meta.progressSeconds === 0) {
            meta.progressSeconds = extractProgressFromUrl(current);
        }
        return meta;
    }
    return meta;
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
    }
    catch (error) {
        return out;
    }
    finally {
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
function fillMetaFromHtml(meta: VideoMeta, html: string, pageUrl: string): void {
    meta.title = extractTitle(html);
    const cover = matchMetaContent(html, 'og:image') || matchMetaContent(html, 'twitter:image') || matchMetaContent(html, 'og:image:url');
    if (cover.length > 0) {
        meta.coverUrl = toAbsoluteUrl(pageUrl, decodeHtml(cover).replace(/&amp;/g, '&'));
    }
    const ogDuration = matchMetaContent(html, 'og:video:duration') || matchMetaContent(html, 'video:duration');
    if (ogDuration.length > 0) {
        meta.durationSeconds = parseDurationValue(ogDuration);
    }
    if (meta.durationSeconds === 0) {
        const jsonDuration = html.match(/"duration"\s*:\s*"?(PT[^"',}]+|\d+)"?/i);
        if (jsonDuration && jsonDuration[1]) {
            meta.durationSeconds = parseDurationValue(jsonDuration[1]);
        }
    }
}
function extractProgressFromUrl(url: string): number {
    const tMatch = url.match(/[?&#](?:t|start|start_progress|starttime)=([0-9hmsHMS:]+)/);
    if (!tMatch || !tMatch[1]) {
        return 0;
    }
    return parseDurationValue(tMatch[1]);
}
function parseDurationValue(raw: string): number {
    const value = raw.trim();
    if (/^\d+(\.\d+)?$/.test(value)) {
        return Math.floor(Number(value));
    }
    const iso = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i);
    if (iso) {
        const hour = iso[1] ? Number(iso[1]) : 0;
        const minute = iso[2] ? Number(iso[2]) : 0;
        const second = iso[3] ? Number(iso[3]) : 0;
        return hour * 3600 + minute * 60 + second;
    }
    if (value.indexOf(':') >= 0) {
        const parts = value.split(':');
        if (parts.length === 2) {
            return Number(parts[0]) * 60 + Number(parts[1]);
        }
        if (parts.length === 3) {
            return Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
        }
    }
    const hm = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
    if (hm && (hm[1] || hm[2] || hm[3])) {
        const hour = hm[1] ? Number(hm[1]) : 0;
        const minute = hm[2] ? Number(hm[2]) : 0;
        const second = hm[3] ? Number(hm[3]) : 0;
        return hour * 3600 + minute * 60 + second;
    }
    return 0;
}
async function tryBilibiliApi(url: string): Promise<VideoMeta> {
    const meta = new VideoMeta();
    meta.progressSeconds = extractProgressFromUrl(url);
    const bv = url.match(/\/video\/(BV[0-9A-Za-z]+)/);
    const av = url.match(/\/video\/av(\d+)/i);
    let api = '';
    if (bv && bv[1]) {
        api = `https://api.bilibili.com/x/web-interface/view?bvid=${bv[1]}`;
    }
    else if (av && av[1]) {
        api = `https://api.bilibili.com/x/web-interface/view?aid=${av[1]}`;
    }
    else {
        return meta;
    }
    const result = await fetchOnce(api);
    if (result.body.length === 0) {
        return meta;
    }
    try {
        const parsed = JSON.parse(result.body) as Record<string, Object>;
        const data = parsed['data'] as Record<string, Object>;
        if (!data) {
            return meta;
        }
        const title = data['title'];
        const pic = data['pic'];
        const duration = data['duration'];
        if (typeof title === 'string') {
            meta.title = cleanTitle(title);
        }
        if (typeof pic === 'string') {
            meta.coverUrl = pic.indexOf('//') === 0 ? `https:${pic}` : pic;
        }
        if (typeof duration === 'number') {
            meta.durationSeconds = Math.floor(duration);
        }
    }
    catch (parseError) {
    }
    return meta;
}
function matchMetaContent(html: string, key: string): string {
    const escaped = key.replace('.', '\\.');
    const patternA = `<meta[^>]*(?:property|name)\\s*=\\s*["']${escaped}["'][^>]*content\\s*=\\s*["']([^"']+)["']`;
    const patternB = `<meta[^>]*content\\s*=\\s*["']([^"']+)["'][^>]*(?:property|name)\\s*=\\s*["']${escaped}["']`;
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
