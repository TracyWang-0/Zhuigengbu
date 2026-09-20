import common from '@ohos.app.ability.common';
import bundleManager from '@ohos.bundle.bundleManager';
import Want from '@ohos.app.ability.Want';
import { detectPlatform, Platform } from '../model/VideoItem';
import { resolveRedirectedUrl } from './TitleResolver';

class UriWant {
  uri: string = '';
}

class BundleWant {
  bundleName: string = '';
}

class BundleAbilityWant {
  bundleName: string = '';
  abilityName: string = '';
}

export async function openVideoLink(context: common.Context, url: string, platform?: Platform,
  progressSeconds: number = 0): Promise<void> {
  const raw = url.trim();
  if (raw.length === 0) {
    return;
  }
  const abilityContext = context as common.UIAbilityContext;
  let resolved = raw;
  try {
    resolved = await resolveRedirectedUrl(raw);
  } catch (resolveError) {
    resolved = raw;
  }
  const source = platform && platform !== '其他' ? platform : detectPlatform(resolved);
  const playbackUrl = canonicalizePlaybackUrl(resolved, source);
  const schemes = nativeSchemesOf(playbackUrl, source, progressSeconds);
  const names = bundleNamesOf(source);

  for (let i = 0; i < schemes.length; i++) {
    if (!canOpenScheme(schemes[i])) {
      continue;
    }
    const implicit = new UriWant();
    implicit.uri = schemes[i];
    if (await tryStartUri(abilityContext, implicit)) {
      return;
    }
  }

  for (let i = 0; i < names.length; i++) {
    const appOnly = new BundleWant();
    appOnly.bundleName = names[i];
    if (await tryStartBundle(abilityContext, appOnly)) {
      return;
    }
    if (await tryStartBundleAbility(abilityContext, names[i], 'EntryAbility')) {
      return;
    }
  }
}

async function tryStartUri(context: common.UIAbilityContext, want: UriWant): Promise<boolean> {
  try {
    await context.startAbility(want);
    return true;
  } catch (startError) {
    return false;
  }
}

async function tryStartBundle(context: common.UIAbilityContext, want: BundleWant): Promise<boolean> {
  try {
    await context.startAbility(want);
    return true;
  } catch (startError) {
    return false;
  }
}

async function tryStartBundleAbility(context: common.UIAbilityContext, bundleName: string, abilityName: string): Promise<boolean> {
  const want = new BundleAbilityWant();
  want.bundleName = bundleName;
  want.abilityName = abilityName;
  try {
    await context.startAbility(want);
    return true;
  } catch (startError) {
    return false;
  }
}

function canOpenScheme(uri: string): boolean {
  try {
    return bundleManager.canOpenLink(uri);
  } catch (queryError) {
    return false;
  }
}

function canonicalizePlaybackUrl(url: string, platform: Platform): string {
  if (platform === '腾讯视频') {
    return tencentPlaybackUrl(url);
  }
  if (platform === '哔哩哔哩') {
    return bilibiliPlaybackUrl(url);
  }
  return url;
}

function nativeSchemesOf(url: string, platform: Platform, seconds: number): string[] {
  if (platform === '腾讯视频') {
    return tencentSchemes(url, seconds);
  }
  if (platform === '哔哩哔哩') {
    return bilibiliSchemes(url, seconds);
  }
  if (platform === '爱奇艺') {
    return iqiyiSchemes(url, seconds);
  }
  if (platform === '优酷') {
    return youkuSchemes(url, seconds);
  }
  if (platform === '芒果TV') {
    return mangoSchemes(url, seconds);
  }
  return [];
}

function tencentPlaybackUrl(url: string): string {
  const cid = firstGroup(url, [/\/cover\/([A-Za-z0-9]+)/i, /[?&]cid=([A-Za-z0-9]+)/i]);
  const vid = firstGroup(url, [
    /[?&]vid=([A-Za-z0-9]+)/i,
    /\/cover\/[A-Za-z0-9]+\/([A-Za-z0-9]+)(?:\.html)?/i,
    /\/x\/page\/([A-Za-z0-9]+)/i,
    /\/page\/([A-Za-z0-9]+)/i
  ]);
  if (cid.length > 0 && vid.length > 0 && cid !== vid) {
    return `https://v.qq.com/x/cover/${cid}/${vid}.html`;
  }
  if (cid.length > 0) {
    return `https://v.qq.com/x/cover/${cid}.html`;
  }
  if (vid.length > 0) {
    return `https://v.qq.com/x/page/${vid}.html`;
  }
  return url;
}

function tencentSchemes(url: string, seconds: number): string[] {
  const cid = firstGroup(url, [/\/cover\/([A-Za-z0-9]+)/i, /[?&]cid=([A-Za-z0-9]+)/i]);
  const vid = firstGroup(url, [
    /[?&]vid=([A-Za-z0-9]+)/i,
    /\/cover\/[A-Za-z0-9]+\/([A-Za-z0-9]+)(?:\.html)?/i,
    /\/x\/page\/([A-Za-z0-9]+)/i,
    /\/page\/([A-Za-z0-9]+)/i
  ]);
  const schemes: string[] = [];
  if (cid.length > 0 && vid.length > 0 && cid !== vid) {
    schemes.push(withTime(`tenvideo2://v.qq.com/x/cover/${cid}/${vid}`, seconds));
    schemes.push(`tenvideo2://?action=5&cover_id=${cid}&id=${vid}`);
    schemes.push(withTime(`txvideo://v.qq.com/x/cover/${cid}/${vid}.html`, seconds));
    schemes.push(withTime(`qqlive://v.qq.com/x/cover/${cid}/${vid}.html`, seconds));
  } else if (cid.length > 0) {
    schemes.push(withTime(`tenvideo2://v.qq.com/x/cover/${cid}`, seconds));
    schemes.push(`tenvideo2://?action=5&cover_id=${cid}`);
    schemes.push(withTime(`txvideo://v.qq.com/x/cover/${cid}.html`, seconds));
  } else if (vid.length > 0) {
    schemes.push(`tenvideo2://?action=5&id=${vid}`);
    schemes.push(withTime(`txvideo://v.qq.com/x/page/${vid}.html`, seconds));
  }
  return unique(schemes);
}

function bilibiliPlaybackUrl(url: string): string {
  const bv = firstGroup(url, [/\/video\/(BV[0-9A-Za-z]+)/]);
  if (bv.length > 0) {
    return `https://www.bilibili.com/video/${bv}`;
  }
  const av = firstGroup(url, [/\/video\/av(\d+)/i, /[?&]aid=(\d+)/i]);
  if (av.length > 0) {
    return `https://www.bilibili.com/video/av${av}`;
  }
  return url;
}

function bilibiliSchemes(url: string, seconds: number): string[] {
  const bv = firstGroup(url, [/\/video\/(BV[0-9A-Za-z]+)/, /[?&]bvid=(BV[0-9A-Za-z]+)/i]);
  const av = firstGroup(url, [/\/video\/av(\d+)/i, /[?&]aid=(\d+)/i]);
  const schemes: string[] = [];
  if (bv.length > 0) {
    schemes.push(withBiliTime(`bilibili://video/${bv}`, seconds));
  }
  if (av.length > 0) {
    schemes.push(withBiliTime(`bilibili://video/${av}`, seconds));
  }
  return unique(schemes);
}

function iqiyiSchemes(url: string, seconds: number): string[] {
  const vid = firstGroup(url, [
    /\/v_([A-Za-z0-9]+)\.html/i,
    /[?&]vid=([A-Za-z0-9]+)/i,
    /[?&]tvid=(\d+)/i
  ]);
  const aid = firstGroup(url, [/\/a_([A-Za-z0-9]+)\.html/i, /[?&]aid=([A-Za-z0-9]+)/i]);
  const schemes: string[] = [];
  if (vid.length > 0) {
    schemes.push(withTime(`iqiyi://mobile/player?vid=${vid}&ftype=27`, seconds));
    schemes.push(withTime(`qiyimobile://mobile/player?vid=${vid}&ftype=27`, seconds));
  }
  if (aid.length > 0) {
    schemes.push(`iqiyi://mobile/player?aid=${aid}&ftype=27`);
  }
  return unique(schemes);
}

function youkuSchemes(url: string, seconds: number): string[] {
  const vid = firstGroup(url, [
    /id_([A-Za-z0-9=]+)(?:\.html)?/i,
    /[?&]vid=([A-Za-z0-9=]+)/i,
    /\/video\/id_([A-Za-z0-9=]+)/i
  ]);
  const schemes: string[] = [];
  if (vid.length > 0) {
    schemes.push(withTime(`youku://play?vid=${vid}`, seconds));
    schemes.push(withTime(`youku://video?id=${vid}`, seconds));
  }
  return unique(schemes);
}

function mangoSchemes(url: string, seconds: number): string[] {
  const vid = firstGroup(url, [
    /\/b\/(\d+)/i,
    /[?&]videoId=(\d+)/i,
    /\/(\d+)\.html/i
  ]);
  const schemes: string[] = [];
  if (vid.length > 0) {
    schemes.push(withTime(`imgotv://player?videoId=${vid}`, seconds));
  }
  return unique(schemes);
}

function withTime(uri: string, seconds: number): string {
  if (seconds <= 0 || uri.indexOf('t=') >= 0) {
    return uri;
  }
  return `${uri}${uri.indexOf('?') >= 0 ? '&' : '?'}t=${seconds}`;
}

function withBiliTime(uri: string, seconds: number): string {
  if (seconds <= 0) {
    return uri;
  }
  return `${uri}?start_progress=${seconds * 1000}`;
}

function unique(values: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < values.length; i++) {
    if (values[i].length > 0 && out.indexOf(values[i]) < 0) {
      out.push(values[i]);
    }
  }
  return out;
}

function firstGroup(text: string, patterns: RegExp[]): string {
  for (let i = 0; i < patterns.length; i++) {
    const match = text.match(patterns[i]);
    if (match && match[1] && match[1].length > 0) {
      return match[1];
    }
  }
  return '';
}

function bundleNamesOf(platform: Platform): string[] {
  if (platform === '腾讯视频') {
    return ['com.tencent.qqlive.hmos', 'com.tencent.qqlive'];
  }
  if (platform === '哔哩哔哩') {
    return ['com.bilibili.bilibiliohos', 'com.bilibili.app.in'];
  }
  if (platform === '爱奇艺') {
    return ['com.qiyi.video.hmos', 'com.qiyi.video'];
  }
  if (platform === '优酷') {
    return ['com.youku.hmos', 'com.youku.phone'];
  }
  if (platform === '芒果TV') {
    return ['com.mgtv.hmos', 'com.hunantv.imgo.activity'];
  }
  return [];
}

export function extractOpenVideoUrl(want: Want): string {
  if (want.uri && /^https?:\/\//i.test(want.uri)) {
    return want.uri;
  }
  const params = want.parameters;
  if (!params) {
    return '';
  }
  const direct = params['openVideoUrl'];
  if (typeof direct === 'string' && direct.length > 0) {
    return direct;
  }
  const nested = params['params'];
  if (typeof nested === 'string' && nested.length > 0) {
    try {
      const parsed = JSON.parse(nested) as Record<string, string>;
      const fromJson = parsed['openVideoUrl'];
      if (fromJson && fromJson.length > 0) {
        return fromJson;
      }
    } catch (parseError) {
      return '';
    }
  }
  if (typeof nested === 'object' && nested) {
    const parsed = nested as Record<string, Object>;
    const value = parsed['openVideoUrl'];
    if (typeof value === 'string') {
      return value;
    }
  }
  return '';
}
