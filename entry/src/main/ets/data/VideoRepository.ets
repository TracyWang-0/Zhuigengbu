import preferences from '@ohos.data.preferences';
import common from '@ohos.app.ability.common';
import { VideoItem } from '../model/VideoItem';

const STORE_NAME = 'zhuigengbu';
const LIST_KEY = 'videos';

export function loadVideosSync(context: common.Context): VideoItem[] {
  try {
    const options: preferences.Options = { name: STORE_NAME };
    const store = preferences.getPreferencesSync(context.getApplicationContext(), options);
    const raw = store.getSync(LIST_KEY, '[]') as string;
    const parsed = JSON.parse(raw) as VideoItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export class VideoRepository {
  private store?: preferences.Preferences;
  private context: common.Context;

  constructor(context: common.Context) {
    this.context = context.getApplicationContext();
  }

  async load(): Promise<VideoItem[]> {
    try {
      const options: preferences.Options = { name: STORE_NAME };
      this.store = await preferences.getPreferences(this.context, options);
      const raw = await this.store.get(LIST_KEY, '[]') as string;
      const parsed = JSON.parse(raw) as VideoItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  async save(items: VideoItem[]): Promise<void> {
    try {
      if (!this.store) {
        const options: preferences.Options = { name: STORE_NAME };
        this.store = await preferences.getPreferences(this.context, options);
      }
      await this.store.put(LIST_KEY, JSON.stringify(items));
      await this.store.flush();
    } catch (error) {
    }
  }
}
