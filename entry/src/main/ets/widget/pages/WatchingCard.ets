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
  @LocalStorageProp('show0') show0: string = '0';
  @LocalStorageProp('title0') title0: string = '';
  @LocalStorageProp('platform0') platform0: string = '';
  @LocalStorageProp('extra0') extra0: string = '';
  @LocalStorageProp('url0') url0: string = '';
  @LocalStorageProp('show1') show1: string = '0';
  @LocalStorageProp('title1') title1: string = '';
  @LocalStorageProp('platform1') platform1: string = '';
  @LocalStorageProp('extra1') extra1: string = '';
  @LocalStorageProp('url1') url1: string = '';
  @LocalStorageProp('show2') show2: string = '0';
  @LocalStorageProp('title2') title2: string = '';
  @LocalStorageProp('platform2') platform2: string = '';
  @LocalStorageProp('extra2') extra2: string = '';
  @LocalStorageProp('url2') url2: string = '';

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
      }.width('100%')

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
      .visibility(this.show0 === '1' ? Visibility.None : Visibility.Visible)
      .onClick(() => this.openVideo(''))

      Column({ space: 8 }) {
        Column({ space: 4 }) {
          Row() {
            Text(this.platform0)
              .fontSize(11)
              .fontColor('#2F6BFF')
              .backgroundColor('#E8F0FF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .borderRadius(6)
            Blank()
            Text(this.extra0)
              .fontSize(11)
              .fontColor('#637083')
          }.width('100%')
          Text(this.title0)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#1C2430')
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')
        }
        .width('100%')
        .padding(10)
        .backgroundColor(Color.White)
        .borderRadius(12)
        .visibility(this.show0 === '1' ? Visibility.Visible : Visibility.None)
        .onClick(() => this.openVideo(this.url0))

        Column({ space: 4 }) {
          Row() {
            Text(this.platform1)
              .fontSize(11)
              .fontColor('#2F6BFF')
              .backgroundColor('#E8F0FF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .borderRadius(6)
            Blank()
            Text(this.extra1)
              .fontSize(11)
              .fontColor('#637083')
          }.width('100%')
          Text(this.title1)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#1C2430')
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')
        }
        .width('100%')
        .padding(10)
        .backgroundColor(Color.White)
        .borderRadius(12)
        .visibility(this.show1 === '1' ? Visibility.Visible : Visibility.None)
        .onClick(() => this.openVideo(this.url1))

        Column({ space: 4 }) {
          Row() {
            Text(this.platform2)
              .fontSize(11)
              .fontColor('#2F6BFF')
              .backgroundColor('#E8F0FF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .borderRadius(6)
            Blank()
            Text(this.extra2)
              .fontSize(11)
              .fontColor('#637083')
          }.width('100%')
          Text(this.title2)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#1C2430')
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')
        }
        .width('100%')
        .padding(10)
        .backgroundColor(Color.White)
        .borderRadius(12)
        .visibility(this.show2 === '1' ? Visibility.Visible : Visibility.None)
        .onClick(() => this.openVideo(this.url2))
      }
      .width('100%')
      .visibility(this.show0 === '1' ? Visibility.Visible : Visibility.None)
    }
    .width('100%')
    .height('100%')
    .padding(14)
    .backgroundColor('#F7F9FC')
  }
}
