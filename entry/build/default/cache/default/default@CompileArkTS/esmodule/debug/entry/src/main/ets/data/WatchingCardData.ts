import type { VideoItem } from '../model/VideoItem';
export const WATCHING_CARD_NAME = 'WatchingCard';
export const FORM_IDS_KEY = 'watchingCardIds';
export interface WatchingCardFields {
    count: string;
    emptyText: string;
    show0: string;
    title0: string;
    platform0: string;
    extra0: string;
    url0: string;
    show1: string;
    title1: string;
    platform1: string;
    extra1: string;
    url1: string;
    show2: string;
    title2: string;
    platform2: string;
    extra2: string;
    url2: string;
}
export function watchingVideos(items: VideoItem[]): VideoItem[] {
    return items
        .filter((item: VideoItem) => !item.completed)
        .sort((a: VideoItem, b: VideoItem) => b.updatedAt - a.updatedAt)
        .slice(0, 3);
}
export function buildWatchingCardData(items: VideoItem[]): WatchingCardFields {
    const slots = watchingVideos(items);
    const data: WatchingCardFields = {
        count: `${slots.length}`,
        emptyText: slots.length === 0 ? '还没有在追的视频' : '正在追的视频',
        show0: slots.length > 0 ? '1' : '0',
        title0: slots.length > 0 ? slots[0].title : '',
        platform0: slots.length > 0 ? slots[0].platform : '',
        extra0: slots.length > 0 ? formatExtra(slots[0]) : '',
        url0: slots.length > 0 ? slots[0].url : '',
        show1: slots.length > 1 ? '1' : '0',
        title1: slots.length > 1 ? slots[1].title : '',
        platform1: slots.length > 1 ? slots[1].platform : '',
        extra1: slots.length > 1 ? formatExtra(slots[1]) : '',
        url1: slots.length > 1 ? slots[1].url : '',
        show2: slots.length > 2 ? '1' : '0',
        title2: slots.length > 2 ? slots[2].title : '',
        platform2: slots.length > 2 ? slots[2].platform : '',
        extra2: slots.length > 2 ? formatExtra(slots[2]) : '',
        url2: slots.length > 2 ? slots[2].url : ''
    };
    return data;
}
function formatExtra(item: VideoItem): string {
    if (item.episode > 0) {
        return item.totalEpisodes > 0 ? `第 ${item.episode} 集 / ${item.totalEpisodes}` : `第 ${item.episode} 集`;
    }
    return '继续观看';
}
