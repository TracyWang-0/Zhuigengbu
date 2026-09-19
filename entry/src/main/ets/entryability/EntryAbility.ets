import UIAbility from '@ohos.app.ability.UIAbility';
import AbilityConstant from '@ohos.app.ability.AbilityConstant';
import Want from '@ohos.app.ability.Want';
import window from '@ohos.window';
import { extractOpenVideoUrl, openVideoLink } from '../data/VideoLauncher';

export default class EntryAbility extends UIAbility {
  private pendingVideoUrl: string = '';

  onCreate(want: Want, _launchParam: AbilityConstant.LaunchParam): void {
    this.pendingVideoUrl = extractOpenVideoUrl(want);
  }

  onNewWant(want: Want, _launchParam: AbilityConstant.LaunchParam): void {
    const url = extractOpenVideoUrl(want);
    if (url.length > 0) {
      openVideoLink(this.context, url).catch((error: Error) => {
      });
    }
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.loadContent('pages/Index', (err) => {
      if (err.code) {
        return;
      }
      if (this.pendingVideoUrl.length > 0) {
        const url = this.pendingVideoUrl;
        this.pendingVideoUrl = '';
        openVideoLink(this.context, url).catch((error: Error) => {
        });
      }
    });
  }
}
