export type Platform = '哔哩哔哩' | '腾讯视频' | '爱奇艺' | '优酷' | '芒果TV' | '其他';

export interface VideoItem {
  id: string;
  title: string;
  platform: Platform;
  url: string;
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

export function detectPlatform(url: string): Platform {
  const value = url.toLowerCase();
  if (value.includes('bilibili.com') || value.includes('b23.tv')) return '哔哩哔哩';
  if (value.includes('v.qq.com')) return '腾讯视频';
  if (value.includes('iqiyi.com')) return '爱奇艺';
  if (value.includes('youku.com')) return '优酷';
  if (value.includes('mgtv.com')) return '芒果TV';
  return '其他';
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
  const parts = value.trim().split(':').map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part) || part < 0) || parts.length > 3) return 0;
  if (parts.length === 1) return Math.floor(parts[0]);
  if (parts.length === 2) return Math.floor(parts[0] * 60 + parts[1]);
  return Math.floor(parts[0] * 3600 + parts[1] * 60 + parts[2]);
}
