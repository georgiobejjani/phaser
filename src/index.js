
import Phaser from "phaser";
import PreloadScene from "./scene/PreloadScene";
import Scratch from "./scene/Scratch";
import StartScene from "./scene/StartScene";
import CustomButton from "./scene/CustomButton";

const WIDTH = 1200;
const HEIGHT = 800;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
}

const Scenes = [PreloadScene,StartScene,Scratch];

const initScenes = () => Scenes.map((Scene) => new Scene(SHARED_CONFIG))

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt:true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug:true
    },
  },
  scene: initScenes()
}; 

  new Phaser.Game(config);
