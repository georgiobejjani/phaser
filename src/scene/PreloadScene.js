import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor(config) { 
        super("PreloadScene");

    }

    preload() {
    this.load.image("bg-game", "assets/forestBackground.jpg");
    this.load.image("sky", "assets/sky.png");
    this.load.image("skyblack", "assets/unscratchedBg.png");
    this.load.image("brush","assets/brush.png");
    this.load.image("button1","assets/green_button01.png");
    this.load.image("button2","assets/green_button02.png");
    this.load.image("button3","assets/green_button03.png");
    this.load.image("rainDrop","assets/rain-drop.png");
    this.load.image("board","assets/board.png");
    this.load.image("header_act","assets/header_act.png");
    this.load.audio("buttonClick",["assets/Audio/buttonClick.ogg"])
    this.load.audio("storm",["assets/Audio/rainSound.mp3"])
    this.load.spritesheet("manWalk","assets/SpriteSheet/man-walking-sprite.png", {
        frameWidth:75,frameHeight:150
    });
    }
    
    create() {
        this.scene.start('StartScene')
    }
    

}

export default PreloadScene;