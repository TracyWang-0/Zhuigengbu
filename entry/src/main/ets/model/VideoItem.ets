export type Platform = '哔哩哔哩' | '腾讯视频' | '爱奇艺' | '优酷' | '芒果TV' | '其他';

export interface VideoItem {
  id: string;
  title: string;
  platform: Platform;
  url: string;
  coverUrl: string;
  episode: number;
  totalEpisodes: number;
  progressSeconds: number;
  durationSeconds: number;
  note: string;
  completed: boolean;
  updatedAt: number;
  platformVideoId: string;
  syncMode: 'manual' | 'official-api';
}

export const PLATFORMS: Platform[] = ['哔哩哔哩', '腾讯视频', '爱奇艺', '优酷', '芒果TV', '其他'];

export function detectPlatform(text: string): Platform {
  const value = text.toLowerCase();
  if (containsAny(value, ['bilibili.com', 'b23.tv', 'b23.wtf', 'bili2233.cn', 'bili22.cn', 'bilibili://', '哔哩哔哩', 'bilibili'])) {
    return '哔哩哔哩';
  }
  if (containsAny(value, [
    'v.qq.com', 'm.v.qq.com', '3g.v.qq.com', 'film.qq.com', 'video.qq.com',
    'wetv.vip', 'tencentvideo.com', 'tenvideo2://', 'txvideo://', 'qqlive://', '腾讯视频'
  ])) {
    return '腾讯视频';
  }
  if (containsAny(value, ['iqiyi.com', 'iqiyi.cn', 'iq.com', 'qiyi.com', 'pps.tv', 'iqiyipic.com', 'iqiyi://', '爱奇艺'])) {
    return '爱奇艺';
  }
  if (containsAny(value, ['youku.com', 'youku.tv', 'soku.com', 'ykimg.com', 'youku://', '优酷'])) {
    return '优酷';
  }
  if (containsAny(value, ['mgtv.com', 'hunantv.com', 'imgo.tv', '芒果tv', '芒果TV'])) {
    return '芒果TV';
  }
  return '其他';
}

function containsAny(value: string, tokens: string[]): boolean {
  for (let i = 0; i < tokens.length; i++) {
    if (value.indexOf(tokens[i]) >= 0) {
      return true;
    }
  }
  return false;
}

export function toTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hour = Math.floor(safe / 3600);
  const minute = Math.floor((safe % 3600) / 60);
  const second = safe % 60;
  const core = `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  return hour > 0 ? `${hour.toString().padStart(2, '0')}:${core}` : core;
}

export function parseTime(value: string): number {
  const parts = value.trim().split(':').map((part: string) => Number(part));
  if (parts.some((part: number) => !Number.isFinite(part) || part < 0) || parts.length > 3) {
    return 0;
  }
  if (parts.length === 1) {
    return Math.floor(parts[0]);
  }
  if (parts.length === 2) {
    return Math.floor(parts[0] * 60 + parts[1]);
  }
  return Math.floor(parts[0] * 3600 + parts[1] * 60 + parts[2]);
}
