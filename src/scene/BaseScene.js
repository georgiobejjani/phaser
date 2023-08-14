import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
    constructor(key,config) { 
        super(key); 
        this.config = config;
        this.image = null;
        this.scaleFactor = null;
        this.screenCenter = [config.width / 2, config.height/2];
        this.particles = null;
    }
    
    create() {
       this.createbackground();
       const storm = this.sound.add("storm", { loop: true });
    //    storm.play();
        this.addRain();
    }

    update() {
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