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
    coverUrl?: string;
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
import { PLATFORMS, detectPlatform, parseTime, toTime } from "@bundle:com.example.zhuigengbu/entry/ets/model/VideoItem";
import type { Platform, VideoItem } from "@bundle:com.example.zhuigengbu/entry/ets/model/VideoItem";
import { VideoRepository } from "@bundle:com.example.zhuigengbu/entry/ets/data/VideoRepository";
import { parseShareText } from "@bundle:com.example.zhuigengbu/entry/ets/data/ShareParser";
import { resolveVideoMeta } from "@bundle:com.example.zhuigengbu/entry/ets/data/TitleResolver";
import { openVideoLink } from "@bundle:com.example.zhuigengbu/entry/ets/data/VideoLauncher";
import { refreshAllWatchingForms } from "@bundle:com.example.zhuigengbu/entry/ets/data/FormUpdater";
import { CoverThumb } from "@bundle:com.example.zhuigengbu/entry/ets/component/CoverThumb";
import { normalizeCoverUrl } from "@bundle:com.example.zhuigengbu/entry/ets/data/WatchingCardData";
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
        this.__progressText = new ObservedPropertySimplePU('', this, "progressText");
        this.__durationText = new ObservedPropertySimplePU('', this, "durationText");
        this.__coverUrl = new ObservedPropertySimplePU('', this, "coverUrl");
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
        if (params.coverUrl !== undefined) {
            this.coverUrl = params.coverUrl;
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
        this.__coverUrl.purgeDependencyOnElmtId(rmElmtId);
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
        this.__coverUrl.aboutToBeDeleted();
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
    private __coverUrl: ObservedPropertySimplePU<string>;
    get coverUrl() {
        return this.__coverUrl.get();
    }
    set coverUrl(newValue: string) {
        this.__coverUrl.set(newValue);
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
        const loaded = await this.repository.load();
        let changed = false;
        this.videos = loaded.map((item: VideoItem) => {
            const detected = detectPlatform(item.url);
            if (detected !== '其他' && item.platform !== detected) {
                item.platform = detected;
                changed = true;
            }
            if (typeof item.coverUrl !== 'string') {
                item.coverUrl = '';
            }
            else {
                item.coverUrl = normalizeCoverUrl(item.coverUrl);
            }
            return item;
        }).sort((a: VideoItem, b: VideoItem) => b.updatedAt - a.updatedAt);
        if (changed) {
            await this.persist();
        }
        this.fillMissingCovers();
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
        const parsed = parseShareText(value);
        const extractedUrl = parsed.url.length > 0 ? parsed.url : value.trim();
        this.url = extractedUrl;
        const fromUrl = detectPlatform(extractedUrl.length > 0 ? extractedUrl : value);
        this.platform = fromUrl !== '其他' ? fromUrl : detectPlatform(value);
        if (parsed.title.length > 0 && (this.title.trim().length === 0 || this.titleFromLink)) {
            this.title = parsed.title;
            this.titleFromLink = true;
        }
        if (this.titleTimer >= 0) {
            clearTimeout(this.titleTimer);
            this.titleTimer = -1;
        }
        if (!/^https?:\/\//i.test(extractedUrl)) {
            this.resolvingTitle = false;
            if (this.platform === '其他') {
                this.titleHint = '';
            }
            return;
        }
        const token = ++this.titleToken;
        this.resolvingTitle = true;
        this.titleHint = '正在识别标题…';
        this.titleTimer = setTimeout(() => {
            this.fetchMeta(extractedUrl, token);
        }, 450);
    }
    handleTitleChange(value: string): void {
        const parsed = parseShareText(value);
        if (parsed.url.length > 0 && (this.url.trim().length === 0 || this.url.trim() === value.trim())) {
            this.handleUrlChange(value);
            return;
        }
        this.title = value;
        this.titleFromLink = false;
    }
    async fetchMeta(url: string, token: number): Promise<void> {
        try {
            const meta = await resolveVideoMeta(url);
            if (token !== this.titleToken || this.url.trim() !== url) {
                return;
            }
            if (meta.title.length > 0 && (this.title.trim().length === 0 || this.titleFromLink)) {
                this.title = meta.title;
                this.titleFromLink = true;
                this.titleHint = '已根据链接填充标题，可再编辑';
                const episodeMatch = meta.title.match(/第\s*(\d+)\s*集/);
                if (episodeMatch && episodeMatch[1] && this.episodeText.length === 0) {
                    this.episodeText = episodeMatch[1];
                }
            }
            else if (this.title.trim().length > 0) {
                this.titleHint = '已从分享内容识别，可再编辑';
            }
            else {
                this.titleHint = '未能自动识别标题，请手动填写';
            }
            if (meta.coverUrl.length > 0) {
                this.coverUrl = meta.coverUrl;
            }
            if (meta.durationSeconds > 0 && this.durationText.trim().length === 0) {
                this.durationText = toTime(meta.durationSeconds);
            }
            if (meta.progressSeconds > 0 && this.progressText.trim().length === 0) {
                this.progressText = toTime(meta.progressSeconds);
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
    async fillMissingCovers(): Promise<void> {
        let changed = false;
        for (let i = 0; i < this.videos.length; i++) {
            if (typeof this.videos[i].coverUrl === 'string' && this.videos[i].coverUrl.length > 0) {
                continue;
            }
            try {
                const meta = await resolveVideoMeta(this.videos[i].url);
                if (meta.coverUrl.length > 0) {
                    this.videos[i].coverUrl = meta.coverUrl;
                    changed = true;
                }
                if (this.videos[i].durationSeconds === 0 && meta.durationSeconds > 0) {
                    this.videos[i].durationSeconds = meta.durationSeconds;
                    changed = true;
                }
                if (this.videos[i].progressSeconds === 0 && meta.progressSeconds > 0) {
                    this.videos[i].progressSeconds = meta.progressSeconds;
                    changed = true;
                }
            }
            catch (metaError) {
            }
        }
        if (changed) {
            this.videos = this.videos.slice(0);
            await this.persist();
        }
    }
    newVideo(): void {
        this.editingId = '';
        this.title = '';
        this.url = '';
        this.platform = '其他';
        this.episodeText = '';
        this.totalEpisodesText = '';
        this.progressText = '';
        this.durationText = '';
        this.coverUrl = '';
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
        this.progressText = item.progressSeconds > 0 ? toTime(item.progressSeconds) : '';
        this.durationText = item.durationSeconds > 0 ? toTime(item.durationSeconds) : '';
        this.coverUrl = typeof item.coverUrl === 'string' ? item.coverUrl : '';
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
            await refreshAllWatchingForms(context, this.videos);
        }
    }
    async saveVideo(): Promise<void> {
        const parsed = parseShareText(this.url.length > 0 ? this.url : this.title);
        const finalUrl = parsed.url.length > 0 ? parsed.url : this.url.trim();
        const finalTitle = this.title.trim().length > 0 ? this.title.trim() : parsed.title;
        if (finalTitle.length === 0 || finalUrl.length === 0) {
            return;
        }
        if (this.coverUrl.length === 0 || this.durationText.trim().length === 0) {
            try {
                const meta = await resolveVideoMeta(finalUrl);
                if (this.coverUrl.length === 0 && meta.coverUrl.length > 0) {
                    this.coverUrl = meta.coverUrl;
                }
                if (this.durationText.trim().length === 0 && meta.durationSeconds > 0) {
                    this.durationText = toTime(meta.durationSeconds);
                }
                if (this.progressText.trim().length === 0 && meta.progressSeconds > 0) {
                    this.progressText = toTime(meta.progressSeconds);
                }
            }
            catch (metaError) {
            }
        }
        const now = Date.now();
        const detected = detectPlatform(`${finalUrl} ${finalTitle}`);
        const item: VideoItem = {
            id: this.editingId || `${now}`,
            title: finalTitle,
            url: finalUrl,
            coverUrl: normalizeCoverUrl(this.coverUrl),
            platform: detected !== '其他' ? detected : this.platform,
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
    confirmRemove(item: VideoItem): void {
        this.getUIContext().showAlertDialog({
            title: '确认删除',
            message: `确定删除「${item.title}」吗？删除后无法恢复。`,
            autoCancel: true,
            primaryButton: {
                value: '取消',
                action: () => {
                }
            },
            secondaryButton: {
                value: '删除',
                fontColor: '#C53B3B',
                action: () => {
                    this.removeVideo(item.id);
                }
            }
        });
    }
    async openWatch(item: VideoItem): Promise<void> {
        const context = this.getUIContext().getHostContext();
        if (!context) {
            return;
        }
        const detected = detectPlatform(item.url);
        const platform = detected !== '其他' ? detected : item.platform;
        await openVideoLink(context as common.UIAbilityContext, item.url, platform, item.progressSeconds);
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
            Row.create({ space: 12 });
            Row.width('100%');
            Row.onClick(() => this.openWatch(item));
        }, Row);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new CoverThumb(this, {
                        cover: normalizeCoverUrl(item.coverUrl),
                        platform: item.platform,
                        thumbWidth: 84,
                        thumbHeight: 112,
                        radius: 10,
                        fontSize: 11
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 336, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            cover: normalizeCoverUrl(item.coverUrl),
                            platform: item.platform,
                            thumbWidth: 84,
                            thumbHeight: 112,
                            radius: 10,
                            fontSize: 11
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        cover: normalizeCoverUrl(item.coverUrl),
                        platform: item.platform,
                        thumbWidth: 84,
                        thumbHeight: 112,
                        radius: 10,
                        fontSize: 11
                    });
                }
            }, { name: "CoverThumb" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.layoutWeight(1);
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
            Text.maxLines(2);
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
            if (item.progressSeconds > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
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
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
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
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
        }, Row);
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
            Button.onClick(() => this.confirmRemove(item));
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
                } }, {
                height: 680,
                showClose: true,
                dragBar: true,
                title: this.editorSheetTitle()
            });
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
                        List.padding({ bottom: 56 });
                        List.scrollBar(BarState.Off);
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
            Button.margin({ left: 20, right: 20, bottom: 16 });
            Button.onClick(() => this.newVideo());
        }, Button);
        Button.pop();
        Stack.pop();
    }
    editorSheetTitle(): SheetTitleOptions {
        const options: SheetTitleOptions = {
            title: this.editingId.length > 0 ? '更新进度' : '添加视频'
        };
        return options;
    }
    EditorSheet(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.padding({ left: 20, right: 20, top: 24, bottom: 36 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '视频标题（可粘贴分享口令）', text: this.title });
            TextInput.onChange((value: string) => this.handleTitleChange(value));
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '粘贴分享内容或链接（必填）', text: this.url });
            TextInput.onChange((value: string) => this.handleUrlChange(value));
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('平台标签');
            Text.fontSize(13);
            Text.fontColor('#637083');
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap });
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const name = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(name);
                    Text.fontSize(12);
                    Text.fontColor(this.platform === name ? Color.White : '#2F6BFF');
                    Text.backgroundColor(this.platform === name ? '#2F6BFF' : '#E8F0FF');
                    Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
                    Text.borderRadius(8);
                    Text.margin({ right: 8, bottom: 8 });
                    Text.onClick(() => this.platform = name);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, PLATFORMS, forEachItemGenFunction, (name: Platform) => name, false, false);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
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
