import FormExtensionAbility from '@ohos.app.form.FormExtensionAbility';
import formBindingData from '@ohos.app.form.formBindingData';
import formInfo from '@ohos.app.form.formInfo';
import Want from '@ohos.app.ability.Want';
import { buildWatchingCardData } from '../data/WatchingCardData';
import { loadVideosSync } from '../data/VideoRepository';
import { forgetFormId, rememberFormId, refreshWatchingForm } from '../data/FormUpdater';

export default class EntryFormAbility extends FormExtensionAbility {
  onAddForm(want: Want): formBindingData.FormBindingData {
    const formId = this.readFormId(want);
    const videos = loadVideosSync(this.context);
    if (formId.length > 0) {
      rememberFormId(this.context, formId).then(() => {
        return refreshWatchingForm(this.context, formId);
      }).catch(() => {
      });
    }
    return formBindingData.createFormBindingData(buildWatchingCardData(videos));
  }

  onUpdateForm(formId: string): void {
    refreshWatchingForm(this.context, formId).catch(() => {
    });
  }

  onFormEvent(formId: string, _message: string): void {
    refreshWatchingForm(this.context, formId).catch(() => {
    });
  }

  onRemoveForm(formId: string): void {
    forgetFormId(this.context, formId).catch(() => {
    });
  }

  onCastToNormalForm(_formId: string): void {
  }

  private readFormId(want: Want): string {
    const value = want.parameters?.[formInfo.FormParam.IDENTITY_KEY];
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      return `${value}`;
    }
    return '';
  }
}
