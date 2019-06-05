

import "phaser";

import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";
import GameConfig = Phaser.Types.Core.GameConfig
import { DEBUG } from "./constants/debug";

// main game configuration
const config: GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: [
    new BootScene(), 
    new GameScene()
  ],
  physics: {
    default: "arcade",
    arcade: {
      debug: DEBUG,
      gravity: { y: 0 }
    }
  },
  input: {
    keyboard: true
  },
  render: { pixelArt:true, antialias: false }, 
  

};

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

var game = new Game(config);
