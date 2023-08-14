import BaseScene from "./BaseScene";
import CustomButton from "./CustomButton";
export default class StartScene extends BaseScene {
  constructor(config) {
    super("StartScene", { ...config });
    this.config = config;
    this.manWalking = null;
    this.lineHeight = 70;

    this.menu = [
      { scene: "Scratch", text: "Play Now" },
      { scene: "RulesScene", text: "How To Play" },
    ];
  }

  create() {
    super.create();
    this.createMan();
    this.createMenu();
  }

  update() {
    this.recycleMan();
  }

  createMenu() {
    let lastMenuPositionY = 0;
    this.menu.forEach((menuItem) => {
      console.log(menuItem);
      const menuPosition = [
        this.screenCenter[0],
        this.screenCenter[1] - 50 + lastMenuPositionY,
      ];
      const button = new CustomButton(
        this,
        ...menuPosition,
        "button2",
        "button3",
        menuItem.text
      );
      const buttonClick = this.sound.add("buttonClick", { loop: false });
      this.add.existing(button);
      button
        .setInteractive()
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
          this.scene.start(menuItem.scene);
          buttonClick.play();
        });
      lastMenuPositionY += this.lineHeight;
    });
  }

  createMan() {
    this.manWalking = this.physics.add
      .sprite(this.config.width, this.config.height - 400, "manWalk")
      .setOrigin(0)
      .setScale(1)
      .setFlipX(true)

    this.manWalking.body.velocity.x = -100;

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("manWalk"),
      frameRate: 8,
      repeat: -1,
    });
    this.manWalking.play("walk");
  }

  recycleMan() {
    if (this.manWalking.getBounds().right < 0) {
      this.createMan();
    }
  }
}
