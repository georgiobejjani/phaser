import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
    constructor(key,config) { 
        super(key); 
        this.config = config;
        this.image = null;
        this.scaleFactor = null;
        this.screenCenter = [config.width / 2, config.height/2];
        this.particles = null;
        this.menuGroup = null;
        this.isMenuOpen = false;
        this.menuItem2Texture = 'volume_Icon'
        this.stormSound = true;
    }
    
    create() {
       this.createbackground();
       this.storm = this.sound.add("storm", { loop: true });
       this.storm.play();
       this.addRain();
       this.createCollapseMenu();
    }


    createCollapseMenu() {
        this.menuGroup = this.add.group();

        let menuButon = this.add.image(this.config.width -10, 10,'settings_Icon').setInteractive().setScale(0.2).setOrigin(1,0)
        menuButon.setInteractive();
        menuButon.on('pointerdown',this.toggleMenu,this);

        let menuItem1 = this.createMenuItem(this,1,this.config.width -10,80,'volume_Icon');
        let menuItem2 = this.createMenuItem(this,2,this.config.width -10,150,'expand_Icon');
        let menuItem3 = this.createMenuItem(this,3,this.config.width -10,220,'back_Icon');
        
        this.menuGroup.add(menuItem1);
        this.menuGroup.add(menuItem2);
        this.menuGroup.add(menuItem3);
        
        this.menuGroup.setVisible(false);
       
    }

    createMenuItem(scene,id,x,y,image) {
        let menuItem = scene.add.image(x,y,image).setScale(0.2).setOrigin(1,0)
        menuItem.setInteractive();

        menuItem.on('pointerover', () => {
            scene.input.setDefaultCursor('pointer');
        });
    
        menuItem.on('pointerout', () => {
            scene.input.setDefaultCursor('auto');
        });

        if(id === 1) {
            menuItem.on('pointerdown', () => {
                this.stormSound = !this.stormSound
                console.log('ji',this.stormSound)
                this.stormSound ? this.storm.play() : this.storm.stop();
                this.menuItem2Texture = (this.menuItem2Texture === 'volume_Icon') ? 'volume-muted_Icon' : 'volume_Icon';
                menuItem.setTexture(this.menuItem2Texture);
            });
        } 
        if(id === 2) {
            menuItem.on('pointerdown', () => {
                this.scale.startFullscreen();
            })
        }

        return menuItem
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;

        if(this.isMenuOpen) {
            this.menuGroup.setVisible(true);
            this.tweens.add({
                targets: this.menuGroup.getChildren(),
                alpha: 1,
                duration: 300,
                ease: 'Linear'
            });
        } else {
            this.tweens.add({
                targets: this.menuGroup.getChildren(),
                alpha: 0,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.menuGroup.setVisible(false);
                }
            });
        }
       
    }

    addRain() {
        this.particles = this.add.particles('rainDrop')
        this.particles.createEmitter({
         x: {min: 0, max: 1200},
         y: 0 ,
         lifespan: {min: 5, max: 1000},
         speedY: 1000,
         scaleY: .2,
         scaleX: .01,
         quantity: {min: 2, max: 3},
         blendMode: 'LIGHTEN',
         });

         console.log('particles',this.particles)
    }

    createbackground() {
        this.image = this.add.image(0, 0, 'bg-game');
        this.scaleFactor = this.config.height / this.image.height;
        this.image.setScale(this.scaleFactor).setPosition(this.config.width / 2, this.config.height / 2); 
    }

}

export default BaseScene;