if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WatchingCard_Params {
    emptyText?: string;
    count?: string;
    show0?: string;
    title0?: string;
    platform0?: string;
    extra0?: string;
    url0?: string;
    show1?: string;
    title1?: string;
    platform1?: string;
    extra1?: string;
    url1?: string;
    show2?: string;
    title2?: string;
    platform2?: string;
    extra2?: string;
    url2?: string;
}
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
        this.__show0.purgeDependencyOnElmtId(rmElmtId);
        this.__title0.purgeDependencyOnElmtId(rmElmtId);
        this.__platform0.purgeDependencyOnElmtId(rmElmtId);
        this.__extra0.purgeDependencyOnElmtId(rmElmtId);
        this.__url0.purgeDependencyOnElmtId(rmElmtId);
        this.__show1.purgeDependencyOnElmtId(rmElmtId);
        this.__title1.purgeDependencyOnElmtId(rmElmtId);
        this.__platform1.purgeDependencyOnElmtId(rmElmtId);
        this.__extra1.purgeDependencyOnElmtId(rmElmtId);
        this.__url1.purgeDependencyOnElmtId(rmElmtId);
        this.__show2.purgeDependencyOnElmtId(rmElmtId);
        this.__title2.purgeDependencyOnElmtId(rmElmtId);
        this.__platform2.purgeDependencyOnElmtId(rmElmtId);
        this.__extra2.purgeDependencyOnElmtId(rmElmtId);
        this.__url2.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__emptyText.aboutToBeDeleted();
        this.__count.aboutToBeDeleted();
        this.__show0.aboutToBeDeleted();
        this.__title0.aboutToBeDeleted();
        this.__platform0.aboutToBeDeleted();
        this.__extra0.aboutToBeDeleted();
        this.__url0.aboutToBeDeleted();
        this.__show1.aboutToBeDeleted();
        this.__title1.aboutToBeDeleted();
        this.__platform1.aboutToBeDeleted();
        this.__extra1.aboutToBeDeleted();
        this.__url1.aboutToBeDeleted();
        this.__show2.aboutToBeDeleted();
        this.__title2.aboutToBeDeleted();
        this.__platform2.aboutToBeDeleted();
        this.__extra2.aboutToBeDeleted();
        this.__url2.aboutToBeDeleted();
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
    private __show0: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('show0', '0', "show0");
    get show0() {
        return this.__show0.get();
    }
    set show0(newValue: string) {
        this.__show0.set(newValue);
    }
    private __title0: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('title0', '', "title0");
    get title0() {
        return this.__title0.get();
    }
    set title0(newValue: string) {
        this.__title0.set(newValue);
    }
    private __platform0: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('platform0', '', "platform0");
    get platform0() {
        return this.__platform0.get();
    }
    set platform0(newValue: string) {
        this.__platform0.set(newValue);
    }
    private __extra0: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('extra0', '', "extra0");
    get extra0() {
        return this.__extra0.get();
    }
    set extra0(newValue: string) {
        this.__extra0.set(newValue);
    }
    private __url0: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('url0', '', "url0");
    get url0() {
        return this.__url0.get();
    }
    set url0(newValue: string) {
        this.__url0.set(newValue);
    }
    private __show1: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('show1', '0', "show1");
    get show1() {
        return this.__show1.get();
    }
    set show1(newValue: string) {
        this.__show1.set(newValue);
    }
    private __title1: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('title1', '', "title1");
    get title1() {
        return this.__title1.get();
    }
    set title1(newValue: string) {
        this.__title1.set(newValue);
    }
    private __platform1: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('platform1', '', "platform1");
    get platform1() {
        return this.__platform1.get();
    }
    set platform1(newValue: string) {
        this.__platform1.set(newValue);
    }
    private __extra1: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('extra1', '', "extra1");
    get extra1() {
        return this.__extra1.get();
    }
    set extra1(newValue: string) {
        this.__extra1.set(newValue);
    }
    private __url1: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('url1', '', "url1");
    get url1() {
        return this.__url1.get();
    }
    set url1(newValue: string) {
        this.__url1.set(newValue);
    }
    private __show2: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('show2', '0', "show2");
    get show2() {
        return this.__show2.get();
    }
    set show2(newValue: string) {
        this.__show2.set(newValue);
    }
    private __title2: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('title2', '', "title2");
    get title2() {
        return this.__title2.get();
    }
    set title2(newValue: string) {
        this.__title2.set(newValue);
    }
    private __platform2: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('platform2', '', "platform2");
    get platform2() {
        return this.__platform2.get();
    }
    set platform2(newValue: string) {
        this.__platform2.set(newValue);
    }
    private __extra2: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('extra2', '', "extra2");
    get extra2() {
        return this.__extra2.get();
    }
    set extra2(newValue: string) {
        this.__extra2.set(newValue);
    }
    private __url2: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('url2', '', "url2");
    get url2() {
        return this.__url2.get();
    }
    set url2(newValue: string) {
        this.__url2.set(newValue);
    }
    private openVideo(url: string): void {
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
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
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
            Column.create();
            Column.width('100%');
            Column.layoutWeight(1);
            Column.justifyContent(FlexAlign.Center);
            Column.visibility(this.show0 === '1' ? Visibility.None : Visibility.Visible);
            Column.onClick(() => this.openVideo(''));
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.width('100%');
            Column.visibility(this.show0 === '1' ? Visibility.Visible : Visibility.None);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.width('100%');
            Column.padding(10);
            Column.backgroundColor(Color.White);
            Column.borderRadius(12);
            Column.visibility(this.show0 === '1' ? Visibility.Visible : Visibility.None);
            Column.onClick(() => this.openVideo(this.url0));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.platform0);
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
            Text.create(this.extra0);
            Text.fontSize(11);
            Text.fontColor('#637083');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title0);
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#1C2430');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.width('100%');
            Column.padding(10);
            Column.backgroundColor(Color.White);
            Column.borderRadius(12);
            Column.visibility(this.show1 === '1' ? Visibility.Visible : Visibility.None);
            Column.onClick(() => this.openVideo(this.url1));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.platform1);
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
            Text.create(this.extra1);
            Text.fontSize(11);
            Text.fontColor('#637083');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title1);
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#1C2430');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.width('100%');
            Column.padding(10);
            Column.backgroundColor(Color.White);
            Column.borderRadius(12);
            Column.visibility(this.show2 === '1' ? Visibility.Visible : Visibility.None);
            Column.onClick(() => this.openVideo(this.url2));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.platform2);
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
            Text.create(this.extra2);
            Text.fontSize(11);
            Text.fontColor('#637083');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title2);
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#1C2430');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
        }, Text);
        Text.pop();
        Column.pop();
        Column.pop();
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
