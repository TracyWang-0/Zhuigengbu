if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CoverThumb_Params {
    cover?: string;
    platform?: string;
    thumbWidth?: number;
    thumbHeight?: number;
    radius?: number;
    fontSize?: number;
    loadFailed?: boolean;
}
export class CoverThumb extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__cover = new SynchedPropertySimpleOneWayPU(params.cover, this, "cover");
        this.__platform = new SynchedPropertySimpleOneWayPU(params.platform, this, "platform");
        this.__thumbWidth = new SynchedPropertySimpleOneWayPU(params.thumbWidth, this, "thumbWidth");
        this.__thumbHeight = new SynchedPropertySimpleOneWayPU(params.thumbHeight, this, "thumbHeight");
        this.__radius = new SynchedPropertySimpleOneWayPU(params.radius, this, "radius");
        this.__fontSize = new SynchedPropertySimpleOneWayPU(params.fontSize, this, "fontSize");
        this.__loadFailed = new ObservedPropertySimplePU(false, this, "loadFailed");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CoverThumb_Params) {
        if (params.cover === undefined) {
            this.__cover.set('');
        }
        if (params.platform === undefined) {
            this.__platform.set('');
        }
        if (params.thumbWidth === undefined) {
            this.__thumbWidth.set(84);
        }
        if (params.thumbHeight === undefined) {
            this.__thumbHeight.set(112);
        }
        if (params.radius === undefined) {
            this.__radius.set(10);
        }
        if (params.fontSize === undefined) {
            this.__fontSize.set(11);
        }
        if (params.loadFailed !== undefined) {
            this.loadFailed = params.loadFailed;
        }
    }
    updateStateVars(params: CoverThumb_Params) {
        this.__cover.reset(params.cover);
        this.__platform.reset(params.platform);
        this.__thumbWidth.reset(params.thumbWidth);
        this.__thumbHeight.reset(params.thumbHeight);
        this.__radius.reset(params.radius);
        this.__fontSize.reset(params.fontSize);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__cover.purgeDependencyOnElmtId(rmElmtId);
        this.__platform.purgeDependencyOnElmtId(rmElmtId);
        this.__thumbWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__thumbHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__radius.purgeDependencyOnElmtId(rmElmtId);
        this.__fontSize.purgeDependencyOnElmtId(rmElmtId);
        this.__loadFailed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__cover.aboutToBeDeleted();
        this.__platform.aboutToBeDeleted();
        this.__thumbWidth.aboutToBeDeleted();
        this.__thumbHeight.aboutToBeDeleted();
        this.__radius.aboutToBeDeleted();
        this.__fontSize.aboutToBeDeleted();
        this.__loadFailed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __cover: SynchedPropertySimpleOneWayPU<string>;
    get cover() {
        return this.__cover.get();
    }
    set cover(newValue: string) {
        this.__cover.set(newValue);
    }
    private __platform: SynchedPropertySimpleOneWayPU<string>;
    get platform() {
        return this.__platform.get();
    }
    set platform(newValue: string) {
        this.__platform.set(newValue);
    }
    private __thumbWidth: SynchedPropertySimpleOneWayPU<number>;
    get thumbWidth() {
        return this.__thumbWidth.get();
    }
    set thumbWidth(newValue: number) {
        this.__thumbWidth.set(newValue);
    }
    private __thumbHeight: SynchedPropertySimpleOneWayPU<number>;
    get thumbHeight() {
        return this.__thumbHeight.get();
    }
    set thumbHeight(newValue: number) {
        this.__thumbHeight.set(newValue);
    }
    private __radius: SynchedPropertySimpleOneWayPU<number>;
    get radius() {
        return this.__radius.get();
    }
    set radius(newValue: number) {
        this.__radius.set(newValue);
    }
    private __fontSize: SynchedPropertySimpleOneWayPU<number>;
    get fontSize() {
        return this.__fontSize.get();
    }
    set fontSize(newValue: number) {
        this.__fontSize.set(newValue);
    }
    private __loadFailed: ObservedPropertySimplePU<boolean>;
    get loadFailed() {
        return this.__loadFailed.get();
    }
    set loadFailed(newValue: boolean) {
        this.__loadFailed.set(newValue);
    }
    private showImage(): boolean {
        return this.cover.length > 0 && !this.loadFailed;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(this.thumbWidth);
            Stack.height(this.thumbHeight);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(this.thumbWidth);
            Column.height(this.thumbHeight);
            Column.justifyContent(FlexAlign.Center);
            Column.backgroundColor('#E8F0FF');
            Column.borderRadius(this.radius);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.platform);
            Text.fontSize(this.fontSize);
            Text.fontColor('#2F6BFF');
            Text.maxLines(2);
            Text.textAlign(TextAlign.Center);
            Text.padding(4);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showImage()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.cover);
                        Image.width(this.thumbWidth);
                        Image.height(this.thumbHeight);
                        Image.borderRadius(this.radius);
                        Image.objectFit(ImageFit.Cover);
                        Image.onError(() => {
                            this.loadFailed = true;
                        });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
