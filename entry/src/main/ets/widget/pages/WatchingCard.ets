import { parseWidgetVideos, WidgetVideo } from '../../data/WatchingCardData';
import { CoverThumb } from '../../component/CoverThumb';

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

@Entry(STORAGE)
@Component
struct WatchingCard {
  @LocalStorageProp('emptyText') emptyText: string = '正在追的视频';
  @LocalStorageProp('count') count: string = '0';
  @LocalStorageProp('videosJson') videosJson: string = '[]';

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

  build() {
    Column({ space: 8 }) {
      Row() {
        Text('追更簿')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#1C2430')
        Blank()
        Text(this.count === '0' ? '在追' : `${this.count} 部在追`)
          .fontSize(12)
          .fontColor('#2F6BFF')
      }
      .width('100%')
      .onClick(() => this.openApp())

      if (this.videoRows().length === 0) {
        Column() {
          Text(this.emptyText)
            .fontSize(14)
            .fontColor('#637083')
          Text('打开应用添加正在追的视频')
            .fontSize(12)
            .fontColor('#8A94A6')
            .margin({ top: 4 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        List({ space: 8 }) {
          ForEach(this.videoRows(), (item: WidgetVideo) => {
            ListItem() {
              Row({ space: 8 }) {
                CoverThumb({
                  cover: item.cover,
                  platform: item.platform,
                  thumbWidth: 48,
                  thumbHeight: 64,
                  radius: 8,
                  fontSize: 10
                })
                Column({ space: 4 }) {
                  Row() {
                    Text(item.platform)
                      .fontSize(11)
                      .fontColor('#2F6BFF')
                      .backgroundColor('#E8F0FF')
                      .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                      .borderRadius(6)
                    Blank()
                    Text(item.extra)
                      .fontSize(11)
                      .fontColor('#637083')
                  }.width('100%')
                  Text(item.title)
                    .fontSize(15)
                    .fontWeight(FontWeight.Medium)
                    .fontColor('#1C2430')
                    .maxLines(1)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })
                    .width('100%')
                }.layoutWeight(1)
              }
              .width('100%')
              .padding(10)
              .backgroundColor(Color.White)
              .borderRadius(12)
              .onClick(() => this.openVideo(item.url))
            }
          }, (item: WidgetVideo) => `${item.url}-${item.title}`)
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Auto)
      }
    }
    .width('100%')
    .height('100%')
    .padding(14)
    .backgroundColor('#F7F9FC')
    .onClick(() => this.openApp())
  }
}
