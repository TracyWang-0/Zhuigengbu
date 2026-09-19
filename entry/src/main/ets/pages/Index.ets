import common from '@ohos.app.ability.common';
import { Platform, VideoItem, detectPlatform, parseTime, toTime } from '../model/VideoItem';
import { VideoRepository } from '../data/VideoRepository';
import { resolveVideoTitle } from '../data/TitleResolver';
import { openVideoLink } from '../data/VideoLauncher';
import { refreshAllWatchingForms } from '../data/FormUpdater';

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
  @State progressText: string = '00:00';
  @State durationText: string = '';
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
      } else {
        this.titleHint = '未能自动识别标题，请手动填写';
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

  async openWatch(item: VideoItem): Promise<void> {
    const context = this.getUIContext().getHostContext();
    if (!context) {
      return;
    }
    await openVideoLink(context as common.UIAbilityContext, item.url);
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
      Column({ space: 10 }) {
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
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')
        Text(item.episode > 0 ? `第 ${item.episode} 集${item.totalEpisodes > 0 ? ` / 共 ${item.totalEpisodes} 集` : ''}` : '单集或未填写集数')
          .fontSize(14)
          .fontColor('#637083')
          .width('100%')
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
        if (item.note.length > 0) {
          Text(item.note)
            .fontSize(13)
            .fontColor('#7B8798')
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')
        }
      }
      .width('100%')
      .onClick(() => this.openWatch(item))

      Row({ space: 8 }) {
        Button('继续观看').layoutWeight(1).onClick(() => this.openWatch(item))
        Button('更新进度').layoutWeight(1).onClick(() => this.editVideo(item))
        Button('删除').fontColor('#C53B3B').backgroundColor('#FFF0F0').onClick(() => this.removeVideo(item.id))
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
          }.layoutWeight(1).width('100%')
        }
      }.padding(20).height('100%').backgroundColor('#F7F9FC')
      Button('+ 添加视频')
        .fontSize(16)
        .fontColor(Color.White)
        .backgroundColor('#2F6BFF')
        .borderRadius(24)
        .padding({ left: 20, right: 20 })
        .margin(24)
        .onClick(() => this.newVideo())
    }
    .height('100%')
    .bindSheet($$this.showEditor, this.EditorSheet(), { height: 620, showClose: true })
  }

  @Builder
  EditorSheet() {
    Scroll() {
      Column({ space: 14 }) {
        TextInput({ placeholder: '视频标题（粘贴链接后自动填充）', text: this.title })
          .onChange((value: string) => {
            this.title = value;
            this.titleFromLink = false;
          })
        TextInput({ placeholder: '粘贴视频链接（必填）', text: this.url })
          .onChange((value: string) => this.handleUrlChange(value))
        Text(`平台：${this.platform}`)
          .fontSize(14)
          .fontColor('#637083')
          .width('100%')
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
      }.padding({ left: 20, right: 20, top: 10, bottom: 32 }).width('100%')
    }
  }
}
