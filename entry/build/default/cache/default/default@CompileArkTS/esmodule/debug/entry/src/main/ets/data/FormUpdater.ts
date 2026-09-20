import formBindingData from "@ohos:app.form.formBindingData";
import formProvider from "@ohos:app.form.formProvider";
import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
import type { VideoItem } from '../model/VideoItem';
import { loadVideosSync, VideoRepository } from "@bundle:com.example.zhuigengbu/entry/ets/data/VideoRepository";
import { buildWatchingCardData, FORM_IDS_KEY } from "@bundle:com.example.zhuigengbu/entry/ets/data/WatchingCardData";
const STORE_NAME = 'zhuigengbu';
export async function rememberFormId(context: common.Context, formId: string): Promise<void> {
    const ids = loadFormIdsSync(context);
    if (ids.indexOf(formId) < 0) {
        ids.push(formId);
        saveFormIdsSync(context, ids);
    }
}
export async function forgetFormId(context: common.Context, formId: string): Promise<void> {
    const ids = loadFormIdsSync(context).filter((id: string) => id !== formId);
    saveFormIdsSync(context, ids);
}
export async function refreshWatchingForm(context: common.Context, formId: string): Promise<void> {
    try {
        const videos = loadVideosSync(context);
        await pushFormData(formId, videos);
    }
    catch (error) {
    }
}
export async function refreshAllWatchingForms(context: common.Context, videos?: VideoItem[]): Promise<void> {
    try {
        const items = videos !== undefined ? videos : await new VideoRepository(context).load();
        const ids = loadFormIdsSync(context);
        for (let i = 0; i < ids.length; i++) {
            await pushFormData(ids[i], items);
        }
    }
    catch (error) {
    }
}
async function pushFormData(formId: string, videos: VideoItem[]): Promise<void> {
    try {
        const data = formBindingData.createFormBindingData(buildWatchingCardData(videos));
        await formProvider.updateForm(formId, data);
    }
    catch (error) {
    }
}
function loadFormIdsSync(context: common.Context): string[] {
    try {
        const options: preferences.Options = { name: STORE_NAME };
        const store = preferences.getPreferencesSync(context.getApplicationContext(), options);
        const raw = store.getSync(FORM_IDS_KEY, '[]') as string;
        const parsed = JSON.parse(raw) as string[];
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (error) {
        return [];
    }
}
function saveFormIdsSync(context: common.Context, ids: string[]): void {
    try {
        const options: preferences.Options = { name: STORE_NAME };
        const store = preferences.getPreferencesSync(context.getApplicationContext(), options);
        store.putSync(FORM_IDS_KEY, JSON.stringify(ids));
        store.flush();
    }
    catch (error) {
    }
}
