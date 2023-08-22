import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor(config) { 
        super("PreloadScene");

    }

    preload() {
    this.load.image("bg-game", "assets/forestBackground.jpg");
    this.load.image("sky", "assets/sky.png");
    this.load.image("card_container","assets/buyCard_container.png")
    this.load.image("settings_Icon", "assets/Icons/setting_icon.png");
    this.load.image("volume_Icon", "assets/Icons/volume_icon.png");
    this.load.image("volume-muted_Icon", "assets/Icons/muted_icon.png");
    this.load.image("expand_Icon", "assets/Icons/full-screen_icon.png");
    this.load.image("back_Icon", "assets/Icons/back_Icon.png");
    this.load.image("skyblack", "assets/unscratchedBg.png");
    this.load.image("emitter", "assets/emitter_Scratched.png");
    this.load.image("brush","assets/brush.png");
    this.load.image("greyField","assets/green_button06.png");
    this.load.image("button2","assets/green_button02.png");
    this.load.image("button3","assets/green_button03.png");
    this.load.image("rainDrop","assets/rain-drop.png");
    this.load.image("board","assets/board.png");
    this.load.image("header_act","assets/header_act.png");
    this.load.image("crocodile_animal","assets/Animals/crocodile.png");
    this.load.image("lion_animal","assets/Animals/lion.png");
    this.load.image("notwolf_animal","assets/Animals/notwolf.png");
    this.load.image("panda_animal","assets/Animals/panda.png");
    this.load.image("rino_animal","assets/Animals/rino.png");
    this.load.image("yenn_animal","assets/Animals/yenn.png");
    this.load.audio("buttonClick",["assets/Audio/buttonClick.ogg"])
    this.load.audio("storm",["assets/Audio/rainSound.mp3"])
    this.load.spritesheet("manWalk","assets/SpriteSheet/man-walking-sprite.png", {
        frameWidth:75,frameHeight:150
    });
    }
    
    create() {
        this.scene.start('Scratch')
    }
    

}

export default PreloadScene;