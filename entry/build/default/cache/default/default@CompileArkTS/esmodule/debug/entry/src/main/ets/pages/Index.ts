if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    videos?: VideoItem[];
    filter?: Filter;
    showEditor?: boolean;
    editingId?: string;
    title?: string;
    url?: string;
    platform?: Platform;
    episodeText?: string;
    totalEpisodesText?: string;
    progressText?: string;
    durationText?: string;
    note?: string;
    completed?: boolean;
    resolvingTitle?: boolean;
    titleHint?: string;
    titleFromLink?: boolean;
    repository?: VideoRepository;
    titleToken?: number;
    titleTimer?: number;
}
import type common from "@ohos:app.ability.common";
import { detectPlatform, parseTime, toTime } from "@bundle:com.example.zhuigengbu/entry/ets/model/VideoItem";
import type { Platform, VideoItem } from "@bundle:com.example.zhuigengbu/entry/ets/model/VideoItem";
import { VideoRepository } from "@bundle:com.example.zhuigengbu/entry/ets/data/VideoRepository";
import { resolveVideoTitle } from "@bundle:com.example.zhuigengbu/entry/ets/data/TitleResolver";
import { openVideoLink } from "@bundle:com.example.zhuigengbu/entry/ets/data/VideoLauncher";
import { refreshAllWatchingForms } from "@bundle:com.example.zhuigengbu/entry/ets/data/FormUpdater";
type Filter = '全部' | '在追' | '已看完';
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__videos = new ObservedPropertyObjectPU([], this, "videos");
        this.__filter = new ObservedPropertySimplePU('全部', this, "filter");
        this.__showEditor = new ObservedPropertySimplePU(false, this, "showEditor");
        this.__editingId = new ObservedPropertySimplePU('', this, "editingId");
        this.__title = new ObservedPropertySimplePU('', this, "title");
        this.__url = new ObservedPropertySimplePU('', this, "url");
        this.__platform = new ObservedPropertySimplePU('其他', this, "platform");
        this.__episodeText = new ObservedPropertySimplePU('', this, "episodeText");
        this.__totalEpisodesText = new ObservedPropertySimplePU('', this, "totalEpisodesText");
        this.__progressText = new ObservedPropertySimplePU('00:00', this, "progressText");
        this.__durationText = new ObservedPropertySimplePU('', this, "durationText");
        this.__note = new ObservedPropertySimplePU('', this, "note");
        this.__completed = new ObservedPropertySimplePU(false, this, "completed");
        this.__resolvingTitle = new ObservedPropertySimplePU(false, this, "resolvingTitle");
        this.__titleHint = new ObservedPropertySimplePU('', this, "titleHint");
        this.__titleFromLink = new ObservedPropertySimplePU(false, this, "titleFromLink");
        this.repository = undefined;
        this.titleToken = 0;
        this.titleTimer = -1;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.videos !== undefined) {
            this.videos = params.videos;
        }
        if (params.filter !== undefined) {
            this.filter = params.filter;
        }
        if (params.showEditor !== undefined) {
            this.showEditor = params.showEditor;
        }
        if (params.editingId !== undefined) {
            this.editingId = params.editingId;
        }
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.url !== undefined) {
            this.url = params.url;
        }
        if (params.platform !== undefined) {
            this.platform = params.platform;
        }
        if (params.episodeText !== undefined) {
            this.episodeText = params.episodeText;
        }
        if (params.totalEpisodesText !== undefined) {
            this.totalEpisodesText = params.totalEpisodesText;
        }
        if (params.progressText !== undefined) {
            this.progressText = params.progressText;
        }
        if (params.durationText !== undefined) {
            this.durationText = params.durationText;
        }
        if (params.note !== undefined) {
            this.note = params.note;
        }
        if (params.completed !== undefined) {
            this.completed = params.completed;
        }
        if (params.resolvingTitle !== undefined) {
            this.resolvingTitle = params.resolvingTitle;
        }
        if (params.titleHint !== undefined) {
            this.titleHint = params.titleHint;
        }
        if (params.titleFromLink !== undefined) {
            this.titleFromLink = params.titleFromLink;
        }
        if (params.repository !== undefined) {
            this.repository = params.repository;
        }
        if (params.titleToken !== undefined) {
            this.titleToken = params.titleToken;
        }
        if (params.titleTimer !== undefined) {
            this.titleTimer = params.titleTimer;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__videos.purgeDependencyOnElmtId(rmElmtId);
        this.__filter.purgeDependencyOnElmtId(rmElmtId);
        this.__showEditor.purgeDependencyOnElmtId(rmElmtId);
        this.__editingId.purgeDependencyOnElmtId(rmElmtId);
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__url.purgeDependencyOnElmtId(rmElmtId);
        this.__platform.purgeDependencyOnElmtId(rmElmtId);
        this.__episodeText.purgeDependencyOnElmtId(rmElmtId);
        this.__totalEpisodesText.purgeDependencyOnElmtId(rmElmtId);
        this.__progressText.purgeDependencyOnElmtId(rmElmtId);
        this.__durationText.purgeDependencyOnElmtId(rmElmtId);
        this.__note.purgeDependencyOnElmtId(rmElmtId);
        this.__completed.purgeDependencyOnElmtId(rmElmtId);
        this.__resolvingTitle.purgeDependencyOnElmtId(rmElmtId);
        this.__titleHint.purgeDependencyOnElmtId(rmElmtId);
        this.__titleFromLink.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__videos.aboutToBeDeleted();
        this.__filter.aboutToBeDeleted();
        this.__showEditor.aboutToBeDeleted();
        this.__editingId.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__url.aboutToBeDeleted();
        this.__platform.aboutToBeDeleted();
        this.__episodeText.aboutToBeDeleted();
        this.__totalEpisodesText.aboutToBeDeleted();
        this.__progressText.aboutToBeDeleted();
        this.__durationText.aboutToBeDeleted();
        this.__note.aboutToBeDeleted();
        this.__completed.aboutToBeDeleted();
        this.__resolvingTitle.aboutToBeDeleted();
        this.__titleHint.aboutToBeDeleted();
        this.__titleFromLink.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __videos: ObservedPropertyObjectPU<VideoItem[]>;
    get videos() {
        return this.__videos.get();
    }
    set videos(newValue: VideoItem[]) {
        this.__videos.set(newValue);
    }
    private __filter: ObservedPropertySimplePU<Filter>;
    get filter() {
        return this.__filter.get();
    }
    set filter(newValue: Filter) {
        this.__filter.set(newValue);
    }
    private __showEditor: ObservedPropertySimplePU<boolean>;
    get showEditor() {
        return this.__showEditor.get();
    }
    set showEditor(newValue: boolean) {
        this.__showEditor.set(newValue);
    }
    private __editingId: ObservedPropertySimplePU<string>;
    get editingId() {
        return this.__editingId.get();
    }
    set editingId(newValue: string) {
        this.__editingId.set(newValue);
    }
    private __title: ObservedPropertySimplePU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __url: ObservedPropertySimplePU<string>;
    get url() {
        return this.__url.get();
    }
    set url(newValue: string) {
        this.__url.set(newValue);
    }
    private __platform: ObservedPropertySimplePU<Platform>;
    get platform() {
        return this.__platform.get();
    }
    set platform(newValue: Platform) {
        this.__platform.set(newValue);
    }
    private __episodeText: ObservedPropertySimplePU<string>;
    get episodeText() {
        return this.__episodeText.get();
    }
    set episodeText(newValue: string) {
        this.__episodeText.set(newValue);
    }
    private __totalEpisodesText: ObservedPropertySimplePU<string>;
    get totalEpisodesText() {
        return this.__totalEpisodesText.get();
    }
    set totalEpisodesText(newValue: string) {
        this.__totalEpisodesText.set(newValue);
    }
    private __progressText: ObservedPropertySimplePU<string>;
    get progressText() {
        return this.__progressText.get();
    }
    set progressText(newValue: string) {
        this.__progressText.set(newValue);
    }
    private __durationText: ObservedPropertySimplePU<string>;
    get durationText() {
        return this.__durationText.get();
    }
    set durationText(newValue: string) {
        this.__durationText.set(newValue);
    }
    private __note: ObservedPropertySimplePU<string>;
    get note() {
        return this.__note.get();
    }
    set note(newValue: string) {
        this.__note.set(newValue);
    }
    private __completed: ObservedPropertySimplePU<boolean>;
    get completed() {
        return this.__completed.get();
    }
    set completed(newValue: boolean) {
        this.__completed.set(newValue);
    }
    private __resolvingTitle: ObservedPropertySimplePU<boolean>;
    get resolvingTitle() {
        return this.__resolvingTitle.get();
    }
    set resolvingTitle(newValue: boolean) {
        this.__resolvingTitle.set(newValue);
    }
    private __titleHint: ObservedPropertySimplePU<string>;
    get titleHint() {
        return this.__titleHint.get();
    }
    set titleHint(newValue: string) {
        this.__titleHint.set(newValue);
    }
    private __titleFromLink: ObservedPropertySimplePU<boolean>;
    get titleFromLink() {
        return this.__titleFromLink.get();
    }
    set titleFromLink(newValue: boolean) {
        this.__titleFromLink.set(newValue);
    }
    private repository?: VideoRepository;
    private titleToken: number;
    private titleTimer: number;
    aboutToAppear(): void {
        const context = this.getUIContext().getHostContext();
        if (!context) {
            return;
        }
        this.repository = new VideoRepository(context);
        this.loadVideos().then(() => refreshAllWatchingForms(context)).catch(() => {
        });
    }
    async loadVideos(): Promise<void> {
        if (!this.repository) {
            return;
        }
        this.videos = (await this.repository.load()).sort((a: VideoItem, b: VideoItem) => b.updatedAt - a.updatedAt);
    }
    visibleVideos(): VideoItem[] {
        if (this.filter === '在追') {
            return this.videos.filter((item: VideoItem) => !item.completed);
        }
        if (this.filter === '已看完') {
            return this.videos.filter((item: VideoItem) => item.completed);
        }
        return this.videos;
    }
    handleUrlChange(value: string): void {
        this.url = value;
        this.platform = detectPlatform(value);
        if (this.titleTimer >= 0) {
            clearTimeout(this.titleTimer);
            this.titleTimer = -1;
        }
        const trimmed = value.trim();
        if (!/^https?:\/\//i.test(trimmed)) {
            this.resolvingTitle = false;
            this.titleHint = '';
            return;
        }
        if (this.title.trim().length > 0 && !this.titleFromLink) {
            this.resolvingTitle = false;
            return;
        }
        const token = ++this.titleToken;
        this.resolvingTitle = true;
        this.titleHint = '正在识别标题…';
        this.titleTimer = setTimeout(() => {
            this.fetchTitle(trimmed, token);
        }, 450);
    }
    async fetchTitle(url: string, token: number): Promise<void> {
        try {
            const detectedTitle = await resolveVideoTitle(url);
            if (token !== this.titleToken || this.url.trim() !== url) {
                return;
            }
            if (detectedTitle.length > 0 && (this.title.trim().length === 0 || this.titleFromLink)) {
                this.title = detectedTitle;
                this.titleFromLink = true;
                this.titleHint = '已根据链接填充标题，可再编辑';
                const episodeMatch = detectedTitle.match(/第\s*(\d+)\s*集/);
                if (episodeMatch && episodeMatch[1] && this.episodeText.length === 0) {
                    this.episodeText = episodeMatch[1];
                }
            }
            else {
                this.titleHint = '未能自动识别标题，请手动填写';
            }
        }
        catch (_resolveError) {
            if (token === this.titleToken) {
                this.titleHint = '识别失败，请手动填写标题';
            }
        }
        finally {
            if (token === this.titleToken) {
                this.resolvingTitle = false;
            }
        }
    }
    newVideo(): void {
        this.editingId = '';
        this.title = '';
        this.url = '';
        this.platform = '其他';
        this.episodeText = '';
        this.totalEpisodesText = '';
        this.progressText = '00:00';
        this.durationText = '';
        this.note = '';
        this.completed = false;
        this.titleHint = '';
        this.titleFromLink = false;
        this.resolvingTitle = false;
        this.showEditor = true;
    }
    editVideo(item: VideoItem): void {
        this.editingId = item.id;
        this.title = item.title;
        this.url = item.url;
        this.platform = item.platform;
        this.episodeText = item.episode > 0 ? item.episode.toString() : '';
        this.totalEpisodesText = item.totalEpisodes > 0 ? item.totalEpisodes.toString() : '';
        this.progressText = toTime(item.progressSeconds);
        this.durationText = item.durationSeconds > 0 ? toTime(item.durationSeconds) : '';
        this.note = item.note;
        this.completed = item.completed;
        this.titleHint = '';
        this.titleFromLink = false;
        this.resolvingTitle = false;
        this.showEditor = true;
    }
    async persist(): Promise<void> {
        if (!this.repository) {
            return;
        }
        this.videos.sort((a: VideoItem, b: VideoItem) => b.updatedAt - a.updatedAt);
        await this.repository.save(this.videos);
        const context = this.getUIContext().getHostContext();
        if (context) {
            await refreshAllWatchingForms(context);
        }
    }
    async saveVideo(): Promise<void> {
        if (this.title.trim().length === 0 || this.url.trim().length === 0) {
            return;
        }
        const now = Date.now();
        const item: VideoItem = {
            id: this.editingId || `${now}`,
            title: this.title.trim(),
            url: this.url.trim(),
            platform: this.platform === '其他' ? detectPlatform(this.url) : this.platform,
            episode: Number(this.episodeText) || 0,
            totalEpisodes: Number(this.totalEpisodesText) || 0,
            progressSeconds: parseTime(this.progressText),
            durationSeconds: parseTime(this.durationText),
            note: this.note.trim(),
            completed: this.completed,
            updatedAt: now,
            platformVideoId: '',
            syncMode: 'manual'
        };
        const index = this.videos.findIndex((video: VideoItem) => video.id === item.id);
        if (index >= 0) {
            this.videos[index] = item;
        }
        else {
            this.videos.push(item);
        }
        await this.persist();
        this.showEditor = false;
    }
    async removeVideo(id: string): Promise<void> {
        this.videos = this.videos.filter((item: VideoItem) => item.id !== id);
        await this.persist();
    }
    async openWatch(item: VideoItem): Promise<void> {
        const context = this.getUIContext().getHostContext();
        if (!context) {
            return;
        }
        await openVideoLink(context as common.UIAbilityContext, item.url);
    }
    FilterButton(name: Filter, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(name);
            Button.fontColor(this.filter === name ? Color.White : '#3E4B5F');
            Button.backgroundColor(this.filter === name ? '#2F6BFF' : '#EEF2F8');
            Button.borderRadius(18);
            Button.height(36);
            Button.onClick(() => this.filter = name);
        }, Button);
        Button.pop();
    }
    VideoCard(item: VideoItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(16);
            Column.shadow({ radius: 10, color: '#14000000', offsetX: 0, offsetY: 3 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.width('100%');
            Column.onClick(() => this.openWatch(item));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.platform);
            Text.fontSize(12);
            Text.fontColor('#2F6BFF');
            Text.backgroundColor('#E8F0FF');
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            Text.borderRadius(8);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.completed ? '已看完' : '在追');
            Text.fontSize(12);
            Text.fontColor(item.completed ? '#25885A' : '#C46A00');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.title);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.episode > 0 ? `第 ${item.episode} 集${item.totalEpisodes > 0 ? ` / 共 ${item.totalEpisodes} 集` : ''}` : '单集或未填写集数');
            Text.fontSize(14);
            Text.fontColor('#637083');
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.durationSeconds > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Progress.create({
                            value: Math.min(item.progressSeconds, item.durationSeconds),
                            total: item.durationSeconds,
                            type: ProgressType.Linear
                        });
                        Progress.color('#2F6BFF');
                        Progress.backgroundColor('#E6EAF0');
                        Progress.width('100%');
                    }, Progress);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`进度 ${toTime(item.progressSeconds)}${item.durationSeconds > 0 ? ` / ${toTime(item.durationSeconds)}` : ''}`);
            Text.fontSize(14);
            Text.fontColor('#3E4B5F');
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.note.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(item.note);
                        Text.fontSize(13);
                        Text.fontColor('#7B8798');
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('继续观看');
            Button.layoutWeight(1);
            Button.onClick(() => this.openWatch(item));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('更新进度');
            Button.layoutWeight(1);
            Button.onClick(() => this.editVideo(item));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('删除');
            Button.fontColor('#C53B3B');
            Button.backgroundColor('#FFF0F0');
            Button.onClick(() => this.removeVideo(item.id));
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.BottomEnd });
            Stack.height('100%');
            Stack.bindSheet({ value: this.showEditor, changeEvent: newValue => { this.showEditor = newValue; } }, { builder: () => {
                    this.EditorSheet.call(this);
                } }, { height: 620, showClose: true });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(20);
            Column.height('100%');
            Column.backgroundColor('#F7F9FC');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('追更簿');
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('把正在看的内容留在同一个地方');
            Text.fontSize(14);
            Text.fontColor('#637083');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.videos.filter((item: VideoItem) => !item.completed).length} 部在追`);
            Text.fontSize(13);
            Text.fontColor('#2F6BFF');
            Text.backgroundColor('#E8F0FF');
            Text.padding(10);
            Text.borderRadius(16);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.margin({ bottom: 16 });
        }, Row);
        this.FilterButton.bind(this)('全部');
        this.FilterButton.bind(this)('在追');
        this.FilterButton.bind(this)('已看完');
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.visibleVideos().length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 10 });
                        Column.width('100%');
                        Column.padding({ top: 90 });
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('还没有记录');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('添加一个视频链接，从你上次离开的地方继续。');
                        Text.fontSize(14);
                        Text.fontColor('#637083');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 12 });
                        List.layoutWeight(1);
                        List.width('100%');
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
                                    this.VideoCard.bind(this)(item);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.visibleVideos(), forEachItemGenFunction, (item: VideoItem) => item.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+ 添加视频');
            Button.fontSize(16);
            Button.fontColor(Color.White);
            Button.backgroundColor('#2F6BFF');
            Button.borderRadius(24);
            Button.padding({ left: 20, right: 20 });
            Button.margin(24);
            Button.onClick(() => this.newVideo());
        }, Button);
        Button.pop();
        Stack.pop();
    }
    EditorSheet(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.padding({ left: 20, right: 20, top: 10, bottom: 32 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '视频标题（粘贴链接后自动填充）', text: this.title });
            TextInput.onChange((value: string) => {
                this.title = value;
                this.titleFromLink = false;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '粘贴视频链接（必填）', text: this.url });
            TextInput.onChange((value: string) => this.handleUrlChange(value));
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`平台：${this.platform}`);
            Text.fontSize(14);
            Text.fontColor('#637083');
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.titleHint.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.titleHint);
                        Text.fontSize(12);
                        Text.fontColor(this.resolvingTitle ? '#2F6BFF' : '#8A94A6');
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '当前集数', text: this.episodeText });
            TextInput.type(InputType.Number);
            TextInput.layoutWeight(1);
            TextInput.onChange((value: string) => this.episodeText = value);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '总集数', text: this.totalEpisodesText });
            TextInput.type(InputType.Number);
            TextInput.layoutWeight(1);
            TextInput.onChange((value: string) => this.totalEpisodesText = value);
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('观看进度（支持 mm:ss 或 hh:mm:ss）');
            Text.fontSize(13);
            Text.fontColor('#637083');
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '当前，如 12:34', text: this.progressText });
            TextInput.layoutWeight(1);
            TextInput.onChange((value: string) => this.progressText = value);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '总时长，如 45:00', text: this.durationText });
            TextInput.layoutWeight(1);
            TextInput.onChange((value: string) => this.durationText = value);
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '备注（可选）', text: this.note });
            TextInput.onChange((value: string) => this.note = value);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('已看完');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.completed });
            Toggle.onChange((value: boolean) => this.completed = value);
        }, Toggle);
        Toggle.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存');
            Button.fontColor(Color.White);
            Button.backgroundColor('#2F6BFF');
            Button.width('100%');
            Button.onClick(() => this.saveVideo());
        }, Button);
        Button.pop();
        Column.pop();
        Scroll.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.zhuigengbu", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
