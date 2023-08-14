import Phaser from "phaser";

export default class CustomButton extends Phaser.GameObjects.Container {
    constructor(scene,x,y,upTexture,overTexture,text) {

        super(scene,x,y)

        this.upImage = scene.add.image(0,0,upTexture);
        this.overImage = scene.add.image(0,0,overTexture);

        this.text = scene.add.text(0,0,text).setOrigin(0.5)
        this.add(this.upImage);
        this.add(this.overImage);
        this.add(this.text)

        this.overImage.setVisible(false)


        this.setSize(this.upImage.width, this.upImage.height)

        this.setInteractive()
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            this.upImage.setVisible(false)
            this.overImage.setVisible(true)
        })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            this.upImage.setVisible(true)
            this.overImage.setVisible(false)
        })
    }

}