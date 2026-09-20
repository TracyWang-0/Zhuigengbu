import common from '@ohos.app.ability.common';
import { Platform, PLATFORMS, VideoItem, detectPlatform, parseTime, toTime } from '../model/VideoItem';
import { VideoRepository } from '../data/VideoRepository';
import { parseShareText } from '../data/ShareParser';
import { resolveVideoMeta } from '../data/TitleResolver';
import { openVideoLink } from '../data/VideoLauncher';
import { refreshAllWatchingForms } from '../data/FormUpdater';
import { CoverThumb } from '../component/CoverThumb';
import { normalizeCoverUrl } from '../data/WatchingCardData';

type Filter = '全部' | '在追' | '已看完';

@Entry
@Component
struct Index {
  @State videos: VideoItem[] = [];
  @State filter: Filter = '全部';
  @State showEditor: boolean = false;
  @State editingId: string = '';
  @State title: string = '';
  @State url: string = '';
  @State platform: Platform = '其他';
  @State episodeText: string = '';
  @State totalEpisodesText: string = '';
  @State progressText: string = '';
  @State durationText: string = '';
  @State coverUrl: string = '';
  @State note: string = '';
  @State completed: boolean = false;
  @State resolvingTitle: boolean = false;
  @State titleHint: string = '';
  @State titleFromLink: boolean = false;
  private repository?: VideoRepository;
  private titleToken: number = 0;
  private titleTimer: number = -1;

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
      } else {
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
      } else if (this.title.trim().length > 0) {
        this.titleHint = '已从分享内容识别，可再编辑';
      } else {
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
    } catch (_resolveError) {
      if (token === this.titleToken) {
        this.titleHint = '识别失败，请手动填写标题';
      }
    } finally {
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
      } catch (metaError) {
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
      } catch (metaError) {
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
    } else {
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

  @Builder
  FilterButton(name: Filter) {
    Button(name)
      .fontColor(this.filter === name ? Color.White : '#3E4B5F')
      .backgroundColor(this.filter === name ? '#2F6BFF' : '#EEF2F8')
      .borderRadius(18)
      .height(36)
      .onClick(() => this.filter = name)
  }

  @Builder
  VideoCard(item: VideoItem) {
    Column({ space: 10 }) {
      Row({ space: 12 }) {
        CoverThumb({
          cover: normalizeCoverUrl(item.coverUrl),
          platform: item.platform,
          thumbWidth: 84,
          thumbHeight: 112,
          radius: 10,
          fontSize: 11
        })
        Column({ space: 8 }) {
          Row() {
            Text(item.platform)
              .fontSize(12)
              .fontColor('#2F6BFF')
              .backgroundColor('#E8F0FF')
              .padding({ left: 8, right: 8, top: 4, bottom: 4 })
              .borderRadius(8)
            Blank()
            Text(item.completed ? '已看完' : '在追')
              .fontSize(12)
              .fontColor(item.completed ? '#25885A' : '#C46A00')
          }.width('100%')
          Text(item.title)
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')
          Text(item.episode > 0 ? `第 ${item.episode} 集${item.totalEpisodes > 0 ? ` / 共 ${item.totalEpisodes} 集` : ''}` : '单集或未填写集数')
            .fontSize(14)
            .fontColor('#637083')
            .width('100%')
          if (item.progressSeconds > 0) {
            if (item.durationSeconds > 0) {
              Progress({
                value: Math.min(item.progressSeconds, item.durationSeconds),
                total: item.durationSeconds,
                type: ProgressType.Linear
              }).color('#2F6BFF').backgroundColor('#E6EAF0').width('100%')
            }
            Text(`进度 ${toTime(item.progressSeconds)}${item.durationSeconds > 0 ? ` / ${toTime(item.durationSeconds)}` : ''}`)
              .fontSize(14)
              .fontColor('#3E4B5F')
              .width('100%')
          }
          if (item.note.length > 0) {
            Text(item.note)
              .fontSize(13)
              .fontColor('#7B8798')
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .width('100%')
          }
        }.layoutWeight(1)
      }
      .width('100%')
      .onClick(() => this.openWatch(item))

      Row({ space: 8 }) {
        Button('更新进度').layoutWeight(1).onClick(() => this.editVideo(item))
        Button('删除').fontColor('#C53B3B').backgroundColor('#FFF0F0').onClick(() => this.confirmRemove(item))
      }.width('100%')
    }
    .padding(16)
    .backgroundColor(Color.White)
    .borderRadius(16)
    .shadow({ radius: 10, color: '#14000000', offsetX: 0, offsetY: 3 })
    .width('100%')
  }

  build() {
    Stack({ alignContent: Alignment.BottomEnd }) {
      Column() {
        Row() {
          Column({ space: 4 }) {
            Text('追更簿').fontSize(28).fontWeight(FontWeight.Bold)
            Text('把正在看的内容留在同一个地方').fontSize(14).fontColor('#637083')
          }.alignItems(HorizontalAlign.Start)
          Blank()
          Text(`${this.videos.filter((item: VideoItem) => !item.completed).length} 部在追`)
            .fontSize(13)
            .fontColor('#2F6BFF')
            .backgroundColor('#E8F0FF')
            .padding(10)
            .borderRadius(16)
        }.width('100%').margin({ bottom: 20 })
        Row({ space: 8 }) {
          this.FilterButton('全部')
          this.FilterButton('在追')
          this.FilterButton('已看完')
        }.width('100%').margin({ bottom: 16 })
        if (this.visibleVideos().length === 0) {
          Column({ space: 10 }) {
            Text('还没有记录').fontSize(18).fontWeight(FontWeight.Medium)
            Text('添加一个视频链接，从你上次离开的地方继续。').fontSize(14).fontColor('#637083')
          }.width('100%').padding({ top: 90 }).alignItems(HorizontalAlign.Center)
        } else {
          List({ space: 12 }) {
            ForEach(this.visibleVideos(), (item: VideoItem) => {
              ListItem() {
                this.VideoCard(item)
              }
            }, (item: VideoItem) => item.id)
          }.layoutWeight(1).width('100%').padding({ bottom: 56 }).scrollBar(BarState.Off)
        }
      }.padding(20).height('100%').backgroundColor('#F7F9FC')
      Button('+ 添加视频')
        .fontSize(16)
        .fontColor(Color.White)
        .backgroundColor('#2F6BFF')
        .borderRadius(24)
        .padding({ left: 20, right: 20 })
        .margin({ left: 20, right: 20, bottom: 16 })
        .onClick(() => this.newVideo())
    }
    .height('100%')
    .bindSheet($$this.showEditor, this.EditorSheet(), {
      height: 680,
      showClose: true,
      dragBar: true,
      title: this.editorSheetTitle()
    })
  }

  editorSheetTitle(): SheetTitleOptions {
    const options: SheetTitleOptions = {
      title: this.editingId.length > 0 ? '更新进度' : '添加视频'
    };
    return options;
  }

  @Builder
  EditorSheet() {
    Scroll() {
      Column({ space: 14 }) {
        TextInput({ placeholder: '视频标题（可粘贴分享口令）', text: this.title })
          .onChange((value: string) => this.handleTitleChange(value))
        TextInput({ placeholder: '粘贴分享内容或链接（必填）', text: this.url })
          .onChange((value: string) => this.handleUrlChange(value))
        Text('平台标签')
          .fontSize(13)
          .fontColor('#637083')
          .width('100%')
        Flex({ wrap: FlexWrap.Wrap }) {
          ForEach(PLATFORMS, (name: Platform) => {
            Text(name)
              .fontSize(12)
              .fontColor(this.platform === name ? Color.White : '#2F6BFF')
              .backgroundColor(this.platform === name ? '#2F6BFF' : '#E8F0FF')
              .padding({ left: 10, right: 10, top: 6, bottom: 6 })
              .borderRadius(8)
              .margin({ right: 8, bottom: 8 })
              .onClick(() => this.platform = name)
          }, (name: Platform) => name)
        }.width('100%')
        if (this.titleHint.length > 0) {
          Text(this.titleHint)
            .fontSize(12)
            .fontColor(this.resolvingTitle ? '#2F6BFF' : '#8A94A6')
            .width('100%')
        }
        Row({ space: 8 }) {
          TextInput({ placeholder: '当前集数', text: this.episodeText })
            .type(InputType.Number)
            .layoutWeight(1)
            .onChange((value: string) => this.episodeText = value)
          TextInput({ placeholder: '总集数', text: this.totalEpisodesText })
            .type(InputType.Number)
            .layoutWeight(1)
            .onChange((value: string) => this.totalEpisodesText = value)
        }.width('100%')
        Text('观看进度（支持 mm:ss 或 hh:mm:ss）').fontSize(13).fontColor('#637083').width('100%')
        Row({ space: 8 }) {
          TextInput({ placeholder: '当前，如 12:34', text: this.progressText })
            .layoutWeight(1)
            .onChange((value: string) => this.progressText = value)
          TextInput({ placeholder: '总时长，如 45:00', text: this.durationText })
            .layoutWeight(1)
            .onChange((value: string) => this.durationText = value)
        }.width('100%')
        TextInput({ placeholder: '备注（可选）', text: this.note })
          .onChange((value: string) => this.note = value)
        Row() {
          Text('已看完').layoutWeight(1)
          Toggle({ type: ToggleType.Switch, isOn: this.completed })
            .onChange((value: boolean) => this.completed = value)
        }.width('100%')
        Button('保存')
          .fontColor(Color.White)
          .backgroundColor('#2F6BFF')
          .width('100%')
          .onClick(() => this.saveVideo())
      }.padding({ left: 20, right: 20, top: 24, bottom: 36 }).width('100%')
    }
  }
}
