@Component
export struct CoverThumb {
  @Prop cover: string = '';
  @Prop platform: string = '';
  @Prop thumbWidth: number = 84;
  @Prop thumbHeight: number = 112;
  @Prop radius: number = 10;
  @Prop fontSize: number = 11;
  @State private loadFailed: boolean = false;

  private showImage(): boolean {
    return this.cover.length > 0 && !this.loadFailed;
  }

  build() {
    Stack() {
      Column() {
        Text(this.platform)
          .fontSize(this.fontSize)
          .fontColor('#2F6BFF')
          .maxLines(2)
          .textAlign(TextAlign.Center)
          .padding(4)
      }
      .width(this.thumbWidth)
      .height(this.thumbHeight)
      .justifyContent(FlexAlign.Center)
      .backgroundColor('#E8F0FF')
      .borderRadius(this.radius)

      if (this.showImage()) {
        Image(this.cover)
          .width(this.thumbWidth)
          .height(this.thumbHeight)
          .borderRadius(this.radius)
          .objectFit(ImageFit.Cover)
          .onError(() => {
            this.loadFailed = true;
          })
      }
    }
    .width(this.thumbWidth)
    .height(this.thumbHeight)
  }
}
