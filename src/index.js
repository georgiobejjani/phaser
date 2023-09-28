
import Phaser from "phaser";
import LoadingScene from "./scene/LoadingScene";
import Scratch from "./scene/Scratch";
import axios from 'axios';
axios.defaults.baseURL = "http://api.test-ci.moobifun.com/";
const WIDTH = 1200;
const HEIGHT = 800;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
}

const Scenes = [LoadingScene, Scratch];

const initScenes = () => Scenes.map((Scene) => new Scene(SHARED_CONFIG))

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-scratch',
  },
  physics: {
    default: 'arcade',
    arcade: {
      // debug:true
    },
  },
  scene: initScenes()
};

new Phaser.Game(config);

