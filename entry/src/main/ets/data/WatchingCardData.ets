import { VideoItem } from '../model/VideoItem';

export const WATCHING_CARD_NAME = 'WatchingCard';
export const FORM_IDS_KEY = 'watchingCardIds';

export class WidgetVideo {
  title: string = '';
  platform: string = '';
  extra: string = '';
  url: string = '';
  cover: string = '';
}

export interface WatchingCardFields {
  count: string;
  emptyText: string;
  videosJson: string;
}

export function watchingVideos(items: VideoItem[]): VideoItem[] {
  return items
    .filter((item: VideoItem) => !item.completed)
    .sort((a: VideoItem, b: VideoItem) => b.updatedAt - a.updatedAt)
    .slice(0, 10);
}

export function buildWatchingCardData(items: VideoItem[]): WatchingCardFields {
  const slots = watchingVideos(items);
  const rows: WidgetVideo[] = [];
  for (let i = 0; i < slots.length; i++) {
    const row = new WidgetVideo();
    row.title = slots[i].title;
    row.platform = slots[i].platform;
    row.extra = formatExtra(slots[i]);
    row.url = slots[i].url;
    row.cover = normalizeCoverUrl(coverOf(slots[i]));
    rows.push(row);
  }
  const data: WatchingCardFields = {
    count: `${slots.length}`,
    emptyText: slots.length === 0 ? '还没有在追的视频' : '正在追的视频',
    videosJson: JSON.stringify(rows)
  };
  return data;
}

export function parseWidgetVideos(raw: string): WidgetVideo[] {
  const rows: WidgetVideo[] = [];
  try {
    const parsed: Object[] = JSON.parse(raw) as Object[];
    if (!Array.isArray(parsed)) {
      return rows;
    }
    for (let i = 0; i < parsed.length; i++) {
      const item: Object = parsed[i];
      const row = new WidgetVideo();
      row.title = fieldOf(item, 'title');
      row.platform = fieldOf(item, 'platform');
      row.extra = fieldOf(item, 'extra');
      row.url = fieldOf(item, 'url');
      row.cover = fieldOf(item, 'cover');
      rows.push(row);
    }
  } catch (parseError) {
  }
  return rows;
}

function fieldOf(item: Object, key: string): string {
  const record = item as Record<string, string>;
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

function coverOf(item: VideoItem): string {
  return typeof item.coverUrl === 'string' ? item.coverUrl : '';
}

export function normalizeCoverUrl(raw: string): string {
  const value = raw.trim();
  if (value.length === 0) {
    return '';
  }
  if (value.indexOf('//') === 0) {
    return `https:${value}`;
  }
  if (value.indexOf('http://') === 0) {
    return `https://${value.substring(7)}`;
  }
  return value;
}

function formatExtra(item: VideoItem): string {
  if (item.episode > 0) {
    return item.totalEpisodes > 0 ? `第 ${item.episode} 集 / ${item.totalEpisodes}` : `第 ${item.episode} 集`;
  }
  return '在追';
}
