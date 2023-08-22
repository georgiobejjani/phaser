import BaseScene from "./BaseScene";
import CustomButton from "./CustomButton";
const SKY_IMAGE = "sky";
const SKY_IMAGE_BLACK = "skyblack";
const BOARD = "board";
const EMITTER = "emitter";

export default class Scratch extends BaseScene {
  constructor(config) {
    super("Scratch", { ...config });
    this.config = config;
    this.isDown = false;
    this.renderTexture = null;
    this.brush = null;
    this.erasedPixels = 0;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.isPointerDown = false;
    this.isClicking = false;
    this.ticketCount = 0;
    this.ticketToPlay = 0;
    this.canvasCollection = [];
  }

  create() {
    super.create();
    this.createTexture();
    this.scratchOff();
    this.Buybuttons();
    this.createInfoContainer();
    this.scratchAll();
    this.playAgainFct();
    this.board = this.make.image({key: BOARD,add: false});
    this.add.image(...this.screenCenter, BOARD).setScale(0.75);
    this.ticketValues = this.add.text(10, 50);
        this.add.image(this.screenCenter[0] - 171, this.screenCenter[1], SKY_IMAGE).setScale(0.76).setDepth(0);

  }


  createInfoContainer() {
    this.animalContainer = this.add.container(this.config.width - 370, 180).setDepth(1);
    
    let Animal1 = this.createAnimal("img", this, 20, 10, "crocodile_animal");
    let Animal2 = this.createAnimal("img", this, 20, 80, "lion_animal");
    let Animal3 = this.createAnimal("img", this, 20, 150, "notwolf_animal");
    let Animal4 = this.createAnimal("img", this, 20, 220, "panda_animal");
    let Animal5 = this.createAnimal("img", this, 20, 290, "rino_animal");
    let Animal6 = this.createAnimal("img", this, 20, 360, "yenn_animal");

    this.animalContainer.add([Animal1,Animal2,Animal3,Animal4,Animal5,Animal6]);
  }

  createAnimal(type, scene, x, y, image) {
    let AnimalItem = null;
    if (type === "img") {
      AnimalItem = scene.add.image(x, y, image).setScale(0.5).setOrigin(1, 0);
    } else {
      AnimalItem = scene.add.text(x, y, image, { fontSize: "30px" }).setOrigin(0.5);
    }
      return AnimalItem;
  }

  createTexture() {
    this.coverImage = this.textures.get(SKY_IMAGE_BLACK).getSourceImage();    
    this.coverHelperCanvas = this.textures.createCanvas("coverTexture",this.coverImage.width,this.coverImage.height);
    this.coverHelperCanvas.draw(0, 0, this.coverImage);
    this.coverHelperCanvas.context.globalCompositeOperation = "destination-out";
    this.canvasCollection = this.coverHelperCanvas;
  }

  scratchOff() {

    this.precent = this.add.text(10, 10, "");

    let cover = this.add.image(this.screenCenter[0] - 171, this.screenCenter[1], "coverTexture").setInteractive().setScale(0.76).setDepth(1);
    

    if (cover.on("pointerdown", this.startDrawing, this))
      if (cover.on("pointerup", this.stopDrawing, this))
        if (cover.on("pointermove", this.clearCover, this))
          this.checkTimer = this.time.addEvent({
            delay: 250,
            loop: true,
            callback: this.checkPercent,
            callbackScope: this,
          });
  }

  startDrawing() {
    this.isPointerDown = true;
  }

  stopDrawing() {
    this.isPointerDown = false;
  }

  clearCover(e, x, y) {
    if (this.isPointerDown) {
      let radius = 50;
      this.coverHelperCanvas.context.beginPath();
      this.coverHelperCanvas.context.arc(x, y, radius, 0, Math.PI * 2, false);
      this.coverHelperCanvas.context.fill();
      this.coverHelperCanvas.update();
      this.onScratchParticles();
    }
  }

  onScratchParticles() {
    this.particles = this.add.particles(EMITTER);
    const emitterConfig = {
      x: this.input.x,
      y: this.input.y,
      speed: { min: 100, max: 200 },
      gravityY: 500,
      lifespan: 500,
      scale: 0.06,
      maxParticles: 5,
    };
    this.emitter = this.particles.createEmitter(emitterConfig);
  }

  destroyParticles() {
    if (this.emitter) {
      this.emitter.stop();
      this.particles.removeEmitter(this.emitter);
      this.emitter = null;
    }
  }

  checkPercent() {
    let full = this.coverImage.width * this.coverImage.height;
    let { data } = this.coverHelperCanvas.context.getImageData(0,0,this.coverImage.width,this.coverImage.height);
    let current = data.filter((v, i) => (i + 1) % 4 == 0 && v > 0).length;
    let percentage = ((current / full) * 100).toFixed(2);
    this.precent.setText(`Cover Percent: ${percentage}%`);

    if (percentage <= 50) {
      this.coverHelperCanvas.context.clearRect(0,0,this.coverImage.width,this.coverImage.height);
      this.coverHelperCanvas.context.beginPath();
      this.coverHelperCanvas.context.globalCompositeOperation = "source-over";
      this.coverHelperCanvas.update();
      this.destroyParticles();
      this.checkTimer.remove();
    }
  }

  addTickets() {
    this.ticketCount++;
    this.ticketCounter.setText(`${this.ticketCount}`);
  }

  removetickets() {
    if (this.ticketCount <= 0) {
      return;
    }
    this.ticketCount--;
    this.ticketCounter.setText(`${this.ticketCount}`);
  }

  buyTicket() {
    if (this.ticketCount > 0) {
      this.ticketToPlay += this.ticketCount;
      this.ticketValues.setText(`Tickets: ${this.ticketToPlay}`);
      this.ticketCount = 0;
      this.ticketCounter.setText(`${this.ticketCount}`);
    }
    this.precent.setText(`Cover Percent: ${percentage}%`);
    localStorage.setItem("tickets", this.ticketToPlay);
  }

  scratchAll() {
    const menuPosition = [this.screenCenter[0] - 390,this.screenCenter[1] + 280];
    
    const self = this;
    
    const scratchAllBtn = new CustomButton(this,...menuPosition,"button2","button3","Scratch All");
    this.add.existing(scratchAllBtn);
    scratchAllBtn.setInteractive();

    scratchAllBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, function () {
      
      const scratchDuration = 150; // Duration of each individual scratch animation in milliseconds
      let radius = 60;
      
      const targetPositions = [
        { x: 100, y: 300 }, 
        { x: 300, y:100 }, 
        { x: 200, y: 500 }, 
        { x: 500, y: 100 }, 
        { x: 400, y: 500 }, 
        { x: 700, y: 100 }, 
        { x: 650, y: 500 }, 
      ];
      
      let currentIndex = 0;
    
      function moveToNextPosition() {
        if (currentIndex < targetPositions.length - 1) {
          currentIndex++;
          const currentTarget = targetPositions[currentIndex - 1];
          const nextTarget = targetPositions[currentIndex];
          
          const moveTween = self.tweens.create({
            targets: self.coverHelperCanvas,
            x: nextTarget.x,
            y: nextTarget.y,
            duration: scratchDuration,
            onUpdate: (tween, target) => {
              const x = Phaser.Math.Linear(currentTarget.x, nextTarget.x, tween.progress);
              const y = Phaser.Math.Linear(currentTarget.y, nextTarget.y, tween.progress);
              self.coverHelperCanvas.context.beginPath();
              self.coverHelperCanvas.context.arc(x, y, radius, 0, Math.PI * 2, false);
              self.coverHelperCanvas.context.fill();
              self.coverHelperCanvas.update();
            },
            onComplete: moveToNextPosition,
          });
          moveTween.play();
        }
      }
      moveToNextPosition();
    }, this); 
  }


  playAgainFct() {
    const menuPosition = [this.screenCenter[0] - 190, this.screenCenter[1] + 280];
  
    const playAgain = new CustomButton(this, ...menuPosition, "button2", "button3", "Play Again");
    this.add.existing(playAgain);
    playAgain.setInteractive();
  
    playAgain.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      // this.createTexture();
      this.coverImage = this.textures.get(SKY_IMAGE_BLACK).getSourceImage(); 
      this.coverHelperCanvas.context.globalCompositeOperation = "source-over";
      this.coverHelperCanvas.context.drawImage(this.coverImage, 0, 0, this.coverImage.width,this.coverImage.height);
      this.coverHelperCanvas.update();
    
   
 this.scratchOff();

    // Re-enable scratching and percentage checking
    let cover = this.add.image(this.screenCenter[0] - 171, this.screenCenter[1], "coverTexture")
      .setInteractive().setScale(0.76).setDepth(1);
    cover.on("pointerdown", this.startDrawing, this);
    cover.on("pointerup", this.stopDrawing, this);
    cover.on("pointermove", this.clearCover, this);
    this.checkTimer = this.time.addEvent({
      delay: 250,
      loop: true,
      callback: this.checkPercent,
      callbackScope: this,
    });
    });
  }

  Buybuttons() {
    const menuPosition = [this.screenCenter[0] + 40,this.screenCenter[1] - 280];
    this.btnsActsContainer = this.add.container().setDepth(1);
    const buttonClick = this.sound.add("buttonClick", { loop: false });
    
    const button = new CustomButton(this,...menuPosition,"button2","button3","Buy Ticket");
    this.add.existing(button);
    button.setInteractive();
    button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      buttonClick.play();
      this.buyTicket();
    });
    this.btnsActsContainer.add(button);

    const AddButton = new CustomButton(this,menuPosition[0] - 160,menuPosition[1],"button2","button3","+").setScale(0.5, 1);
    this.add.existing(AddButton);
    AddButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      buttonClick.play();
      this.addTickets();
    });
    this.btnsActsContainer.add(AddButton);

    const removeButton = new CustomButton(this,menuPosition[0] - 460,menuPosition[1],"button2","button3","-").setScale(0.5, 1);
    this.add.existing(removeButton);
    removeButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      buttonClick.play();
      this.removetickets();
    });
    this.btnsActsContainer.add(removeButton);
    
    this.counterContainer = this.add.image(menuPosition[0] - 405, menuPosition[1] - 25, "greyField").setOrigin(0);
    this.btnsActsContainer.add(this.counterContainer);
    
    const imageCenterX = this.counterContainer.x + this.counterContainer.width / 2;
    const imageCenterY = this.counterContainer.y + this.counterContainer.height / 2;
    this.ticketCounter = this.add.text(imageCenterX, imageCenterY, `${this.ticketCount}`, {fontSize: "32px",fill: "#000",}).setOrigin(0.5).setDepth(1);
  }
}
