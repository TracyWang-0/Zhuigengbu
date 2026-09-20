if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WatchingCard_Params {
    emptyText?: string;
    count?: string;
    videosJson?: string;
}
import { parseWidgetVideos } from "@bundle:com.example.zhuigengbu/entry/ets/data/WatchingCardData";
import type { WidgetVideo } from "@bundle:com.example.zhuigengbu/entry/ets/data/WatchingCardData";
import { CoverThumb } from "@bundle:com.example.zhuigengbu/entry/ets/component/CoverThumb";
const STORAGE = new LocalStorage();
interface CardActionParams {
    openVideoUrl: string;
}
interface CardActionInfo {
    action: string;
    bundleName: string;
    abilityName: string;
    params: CardActionParams;
}
class WatchingCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WatchingCard_Params) {
    }
    updateStateVars(params: WatchingCard_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__emptyText.purgeDependencyOnElmtId(rmElmtId);
        this.__count.purgeDependencyOnElmtId(rmElmtId);
        this.__videosJson.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__emptyText.aboutToBeDeleted();
        this.__count.aboutToBeDeleted();
        this.__videosJson.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __emptyText: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('emptyText', '正在追的视频', "emptyText");
    get emptyText() {
        return this.__emptyText.get();
    }
    set emptyText(newValue: string) {
        this.__emptyText.set(newValue);
    }
    private __count: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('count', '0', "count");
    get count() {
        return this.__count.get();
    }
    set count(newValue: string) {
        this.__count.set(newValue);
    }
    private __videosJson: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('videosJson', '[]', "videosJson");
    get videosJson() {
        return this.__videosJson.get();
    }
    set videosJson(newValue: string) {
        this.__videosJson.set(newValue);
    }
    private videoRows(): WidgetVideo[] {
        return parseWidgetVideos(this.videosJson);
    }
    private openApp(): void {
        const params: CardActionParams = { openVideoUrl: '' };
        const action: CardActionInfo = {
            action: 'router',
            bundleName: 'com.example.zhuigengbu',
            abilityName: 'EntryAbility',
            params: params
        };
        postCardAction(this, action);
    }
    private openVideo(url: string): void {
        if (url.length === 0) {
            this.openApp();
            return;
        }
        const params: CardActionParams = { openVideoUrl: url };
        const action: CardActionInfo = {
            action: 'router',
            bundleName: 'com.example.zhuigengbu',
            abilityName: 'EntryAbility',
            params: params
        };
        postCardAction(this, action);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.width('100%');
            Column.height('100%');
            Column.padding(14);
            Column.backgroundColor('#F7F9FC');
            Column.onClick(() => this.openApp());
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.onClick(() => this.openApp());
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('追更簿');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#1C2430');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.count === '0' ? '在追' : `${this.count} 部在追`);
            Text.fontSize(12);
            Text.fontColor('#2F6BFF');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.videoRows().length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.emptyText);
                        Text.fontSize(14);
                        Text.fontColor('#637083');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('打开应用添加正在追的视频');
                        Text.fontSize(12);
                        Text.fontColor('#8A94A6');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 8 });
                        List.width('100%');
                        List.layoutWeight(1);
                        List.scrollBar(BarState.Auto);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 8 });
                                        Row.width('100%');
                                        Row.padding(10);
                                        Row.backgroundColor(Color.White);
                                        Row.borderRadius(12);
                                        Row.onClick(() => this.openVideo(item.url));
                                    }, Row);
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new CoverThumb(this, {
                                                    cover: item.cover,
                                                    platform: item.platform,
                                                    thumbWidth: 48,
                                                    thumbHeight: 64,
                                                    radius: 8,
                                                    fontSize: 10
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/widget/pages/WatchingCard.ets", line: 87, col: 17 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        cover: item.cover,
                                                        platform: item.platform,
                                                        thumbWidth: 48,
                                                        thumbHeight: 64,
                                                        radius: 8,
                                                        fontSize: 10
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    cover: item.cover,
                                                    platform: item.platform,
                                                    thumbWidth: 48,
                                                    thumbHeight: 64,
                                                    radius: 8,
                                                    fontSize: 10
                                                });
                                            }
                                        }, { name: "CoverThumb" });
                                    }
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 4 });
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.width('100%');
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.platform);
                                        Text.fontSize(11);
                                        Text.fontColor('#2F6BFF');
                                        Text.backgroundColor('#E8F0FF');
                                        Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                        Text.borderRadius(6);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Blank.create();
                                    }, Blank);
                                    Blank.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.extra);
                                        Text.fontSize(11);
                                        Text.fontColor('#637083');
                                    }, Text);
                                    Text.pop();
                                    Row.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.title);
                                        Text.fontSize(15);
                                        Text.fontWeight(FontWeight.Medium);
                                        Text.fontColor('#1C2430');
                                        Text.maxLines(1);
                                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                        Text.width('100%');
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.videoRows(), forEachItemGenFunction, (item: WidgetVideo) => `${item.url}-${item.title}`, false, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "WatchingCard";
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadEtsCard(new WatchingCard(undefined, {}, STORAGE), "com.example.zhuigengbu/entry/ets/widget/pages/WatchingCard");
ViewStackProcessor.StopGetAccessRecording();
