import BaseScene from "./BaseScene";

const SKY_IMAGE = "sky";
const SKY_IMAGE_BLACK = "skyblack";
const BOARD = "board";
const HEADER_ACT = "header_act";
const KEY_BRUSH = "brush";
const BGGAME = "bg-game";

export default class Scratch extends BaseScene {
  constructor(config) {
    super("Scratch", { ...config });
    this.config = config;
    this.isDown = false;
    this.renderTexture = null;
    this.brush = null;
    this.erasedPixels = 0;
    this.screenCenter = [config.width / 2, config.height / 2];
  }


  create() {
    super.create();
    this.cover = this.make.image({
      key: SKY_IMAGE_BLACK,
      add: false,
    });
    this.board = this.make.image({
      key: BOARD,
      add: false,
    });
    this.ScratchOff();
    this.add.image(...this.screenCenter, BOARD).setScale(0.7);
    // console.log(this.board.getBounds());
    // const headerinfo = this.add
    //   .image(this.screenCenter[0] - 160, 130, "header_act")
    //   .setScale(0.7);
    // let helloWorld = this.add
    //   .text(0, 0, "Hello World")

    //   .setFont("20px Arial")
    //   .setColor("#ffffff");

    // const container = this.add.container(headerinfo.x, headerinfo.y);
    // container.add(helloWorld);
  }

  ScratchOff() {
    this.add
      .image(this.screenCenter[0] - 160, this.screenCenter[1], SKY_IMAGE)
      .setScale(0.7);

    this.cover.setOrigin(0, 0);

    const width = this.cover.width;
    const height = this.cover.height;
    console.log(width, height);

    const rt = this.add.renderTexture(
      this.screenCenter[0] - 160,
      this.screenCenter[1],
      width * 0.7,
      height * 0.71
    );
    this.isRenderTextureErased = false;
    this.erasureThreshold = 0.99;
    rt.setOrigin(0.5, 0.5);
    rt.draw(this.cover); //, width * 0.5, height * 0.5)

    rt.setInteractive();
    rt.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
    rt.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this);
    rt.on(Phaser.Input.Events.POINTER_UP, () => (this.isDown = false));

    this.brush = this.make.image({
      key: KEY_BRUSH,
      add: false,
    });

    this.renderTexture = rt;
  }

  handlePointerDown(pointer) {
    this.isDown = true;
    this.handlePointerMove(pointer);
  }

  handlePointerMove(pointer) {
    if (!this.isDown) {
      return;
    }
    const x = pointer.x - this.renderTexture.x + this.renderTexture.width * 0.5;
    const y =
      pointer.y - this.renderTexture.y + this.renderTexture.height * 0.5;
    this.renderTexture.erase(this.brush, x, y);
    const result = this.calculateScratchRatio(x, y);
    console.log("result", result);
  }

  calculateScratchRatio(x, y) {
    const texture = this.textures.get(SKY_IMAGE_BLACK);
    console.log(texture);
    if (!texture) {
      console.error(`Texture with key '${SKY_IMAGE_BLACK}' not found.`);
      return 0;
    }

    console.log(texture);
    const canvas = document.createElement("canvas");
    canvas.width = texture.source[0].width;
    console.log("canvas.width", canvas.width);
    canvas.height = texture.source[0].height;
    const context = canvas.getContext("2d");
    context.drawImage(texture.source[0].image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const pixels = imageData.data;
    console.log(imageData, pixels);
    let erasedCount = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3];
      if (alpha < 128) {
        erasedCount++;
      }
    }

    const totalPixels = canvas.width * canvas.height;
    const scratchRatio = (erasedCount / totalPixels) * 100;

    return Math.round(scratchRatio);
  }
}
