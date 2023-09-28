import Phaser from "phaser";

class LoadingScene extends Phaser.Scene {
    constructor(config) {
        super("LoadingScene", { ...config });
        this.config = config;
    }

    preload() {

      WebFont.load({
        google: {
            families: ['Inter', 'Black Ops One'],
        },
        active: () => {
            // Font is loaded, start the main scene
        },
    });

        this.load.image("bg-game", "assets/scratch/bg_scratch.png");
        this.load.image("EA1", "assets/scratch/values/eagle1.png");
        this.load.image("EA2", "assets/scratch/values/eagle2.png");
        this.load.image("EA3", "assets/scratch/values/elephantt.png");
        this.load.image("EA4", "assets/scratch/values/elephantt2.png");
        this.load.image("EA5", "assets/scratch/values/horse1.png");
        this.load.image("EA6", "assets/scratch/values/horse2.png");
        this.load.image("EA7", "assets/scratch/values/lion1.png");
        this.load.image("EA8", "assets/scratch/values/lion2.png");
        this.load.image("EA9", "assets/scratch/values/tiger1.png");
        this.load.image("EA10", "assets/scratch/values/tiger2.png");
        this.load.image('ball_gratage', "assets/scratch/ball_Scratch.png");
        this.load.image('info-board', "assets/scratch/info-container.png")
        this.load.image('SettingsCnt', "assets/scratch/settingsCnt_scratch.png")
        this.load.image('UnscratchedBg', "assets/scratch/unscratched_bg.png")
        this.load.image('loadingscreen', "../../assets/scratch/loadingScreen.png")
        this.load.image('ticketsWrapper', "assets/scratch/buttons/tickets_btn.png")
        this.load.image('availableTickets', "assets/scratch/buttons/available_tcks.png")
        this.load.image('orangelogo', "assets/scratch/loadinglogo.png");
        this.load.image('ticketPrice', "assets/scratch/ticketPrice.png");
        this.load.image('addTicketOg_Hovered', "assets/scratch/buttons/addTicketOg_scratch.png")
        this.load.image('addTicketW_UnHovered', "assets/scratch/buttons/addTicketW_scratch.png")
        this.load.image('TicketInfo', "assets/scratch/buttons/ticketInfo_btn.png")
        this.load.image('removeTicketOg_Hovered', "assets/scratch/buttons/removeTicketOg_Hovered.png")
        this.load.image('removeTicketW_UnHovered', "assets/scratch/buttons/removeTicketW_UnHovered.png")

        this.load.image('whiteBtn', "assets/scratch/buttons/white_button.png");
        this.load.image('yellowBtn', "assets/scratch/buttons/yellow_btn.png");
        this.load.image('greyBtn', "assets/scratch/buttons/grey_btn.png");

        this.load.image('expand-icon', "assets/scratch/buttons/expand_icon-settings.png");
        this.load.image('Noexpand-icon', "assets/scratch/buttons/Noexpand_icon-settings.png");
        this.load.image('mute-icon', "assets/scratch/buttons/mute-sound_icon-settings.png");
        this.load.image('unmute-icon', "assets/scratch/buttons/unmute-sound_icon-settings.png");
        this.load.image('info-icon', "assets/scratch/buttons/info_icon-settings.png");
        this.load.image('loadingWheel', "assets/scratch/buttons/loadingWheel.png");
        this.load.image('CounterBox', "assets/scratch/buttons/ticketCounter_scratch.png")

        this.load.image("emitter", "assets/emitter_Scratched.png");
        this.load.audio("buttonClick", ["assets/Audio/buttonClick.ogg"])
        this.load.audio("bg-music", ["assets/Audio/bg-music.mp3"])
        this.load.audio("winning-sound", ["assets/Audio/winning-sound.mp3"])
        this.load.audio("loosing-sound", ["assets/Audio/loosing-sound.mp3"])
        this.load.spritesheet("manWalk", "assets/SpriteSheet/rollingball.png", {
            frameWidth: 512, frameHeight: 492
        });
        this.load.spritesheet("loadingAnimation", "assets/SpriteSheet/loading_animation.png", {
            frameWidth: 207.1, frameHeight: 200
        });
    }

    create() {
        this.image = this.add.image(0, 0, 'loadingscreen');
        this.scaleFactor = this.config.height / this.image.height;
        this.image.setScale(this.scaleFactor).setPosition(this.config.width / 2, this.config.height / 2);
        this.add.image(this.config.width / 2, this.config.height - 600, "orangelogo").setScale(0.7)
        this.load.on('complete', () => {
            // Clean up and start the main scene

            this.time.delayedCall(1000, () => {
                this.stopBallAnimation();
                this.scene.start('Scratch');
            });
        });

        // Start loading assets
        this.createBallAnimation();
        this.load.start();
    }
    createBallAnimation() {

        this.loadingAnimation = this.physics.add
            .sprite(this.config.width / 2, this.config.height / 2, "loadingAnimation")
            .setOrigin(0.5)
            .setScale(0.7)


        this.loadingAnimation.body.velocity.x = 0;

        this.anims.create({
            key: "rotate",
            frames: this.anims.generateFrameNumbers("loadingAnimation"),
            frameRate: 6,
            repeat: -1,
        });
        this.loadingAnimation.play("rotate");
    }

    stopBallAnimation() {
        this.loadingAnimation.anims.stop('walk');
        this.loadingAnimation.setFrame(0);
        this.loadingAnimation.destroy();
    }

}

export default LoadingScene;