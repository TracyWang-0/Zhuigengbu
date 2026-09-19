import formBindingData from '@ohos.app.form.formBindingData';
import formProvider from '@ohos.app.form.formProvider';
import preferences from '@ohos.data.preferences';
import common from '@ohos.app.ability.common';
import { VideoRepository } from './VideoRepository';
import { buildWatchingCardData, FORM_IDS_KEY } from './WatchingCardData';

const STORE_NAME = 'zhuigengbu';

export async function rememberFormId(context: common.Context, formId: string): Promise<void> {
  const ids = await loadFormIds(context);
  if (ids.indexOf(formId) < 0) {
    ids.push(formId);
    await saveFormIds(context, ids);
  }
}

export async function forgetFormId(context: common.Context, formId: string): Promise<void> {
  const ids = (await loadFormIds(context)).filter((id: string) => id !== formId);
  await saveFormIds(context, ids);
}

export async function refreshWatchingForm(context: common.Context, formId: string): Promise<void> {
  try {
    const videos = await new VideoRepository(context).load();
    const data = formBindingData.createFormBindingData(buildWatchingCardData(videos));
    await formProvider.updateForm(formId, data);
  } catch (error) {
  }
}

export async function refreshAllWatchingForms(context: common.Context): Promise<void> {
  try {
    const videos = await new VideoRepository(context).load();
    const data = formBindingData.createFormBindingData(buildWatchingCardData(videos));
    const ids = await loadFormIds(context);
    for (let i = 0; i < ids.length; i++) {
      try {
        await formProvider.updateForm(ids[i], data);
      } catch (updateError) {
      }
    }
  } catch (error) {
  }
}

async function loadFormIds(context: common.Context): Promise<string[]> {
  try {
    const options: preferences.Options = { name: STORE_NAME };
    const store = await preferences.getPreferences(context, options);
    const raw = await store.get(FORM_IDS_KEY, '[]') as string;
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

async function saveFormIds(context: common.Context, ids: string[]): Promise<void> {
  try {
    const options: preferences.Options = { name: STORE_NAME };
    const store = await preferences.getPreferences(context, options);
    await store.put(FORM_IDS_KEY, JSON.stringify(ids));
    await store.flush();
  } catch (error) {
  }
}
