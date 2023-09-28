import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
    constructor(key, config) {
        super(key);
        this.config = config;
        this.image = null;
        this.scaleFactor = null;
        this.screenCenter = [config.width / 2, config.height / 2];
        this.particles = null;
        this.menuGroup = null;
        this.isMenuOpen = false;
        this.menuItem2Texture = 'unmute-icon';
        this.menuItem3Texture = 'expand-icon';
        this.music = true;
        this.menuItem2 = null;
    }

    create() {
        this.createbackground();
        this.bgmusic = this.sound.add("bg-music", { loop: true });
        this.bgmusic.play();
        this.createCollapseMenu();
        this.buttonClick = this.sound.add("buttonClick", { loop: false });
        this.events.on("hideIcon", () => {
            if (this.menuItem2) {
                this.menuItem2.setVisible(false);
            }
        });
        this.events.on("showIcon", () => {
            if (this.menuItem2) {
                this.menuItem2.setVisible(true);
            }
        });
    }



    createCollapseMenu() {
        this.settingsWrapper = this.add.image(1100, 400, 'SettingsCnt').setDisplaySize(80, 470).setDepth(1)        // this.muteIcon = new CustomButton(this,1100,300,'unmute-icon','unmute-icon','mute-icon',() => this.playAgainFct(),50,50,'icon')
        // this.expandIcon = new CustomButton(this,1100,470,'expand-icon','expand-icon','none',() => this.scale.startFullscreen(),50,50,'icon')
        this.createMenuItem(this, 1, 1100, 240, 'info-icon');
       this.menuItem2 =  this.createMenuItem(this, 2, 1100, 330, 'TicketInfo');
        this.createMenuItem(this, 3, 1100, 430, 'unmute-icon');
        this.createMenuItem(this, 4, 1100, 540, 'expand-icon');
    }

    createMenuItem(scene, id, x, y, image) {
        let menuItem = scene.add.image(x, y, image).setDisplaySize(40, 40)
        menuItem.setInteractive();
        menuItem.setDepth(2);
        menuItem.on('pointerover', () => {
            scene.input.setDefaultCursor('pointer');
        });

        menuItem.on('pointerout', () => {
            scene.input.setDefaultCursor('auto');
        });

        if (id === 1) {
            menuItem.on('pointerdown', () => {
                this.events.emit('openInfo');
                this.buttonClick.play();

            });
        }
        if (id === 2) {
            menuItem.on('pointerdown', () => {
                this.events.emit('opentckts');
                this.buttonClick.play();
                
            });
        }
        if (id === 3) {
            menuItem.on('pointerdown', () => {
                console.log('touchef', this.bgmusic)
                this.buttonClick.play();
                this.music = !this.music
                this.music ? this.bgmusic.play() : this.bgmusic.stop();
                this.menuItem2Texture = (this.menuItem2Texture === 'unmute-icon') ? 'mute-icon' : 'unmute-icon';
                menuItem.setTexture(this.menuItem2Texture);
            })
        }
        if (id === 4) {
            menuItem.on('pointerdown', () => {
                this.buttonClick.play();
                this.menuItem3Texture = (this.menuItem3Texture === 'expand-icon') ? 'Noexpand-icon' : 'expand-icon';
                menuItem.setTexture(this.menuItem3Texture);
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            })
        }
       
        return menuItem
    }

    createbackground() {
        this.image = this.add.image(0, 0, 'bg-game');
        this.scaleFactor = this.config.height / this.image.height;
        this.image.setScale(this.scaleFactor).setPosition(this.config.width / 2, this.config.height / 2);
    }

}

export default BaseScene;