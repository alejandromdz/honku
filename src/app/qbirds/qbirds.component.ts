import { Component } from '@angular/core';
import { BootScene } from './game/scenes/bootScene';
import { GameScene } from './game/scenes/gameScene';
import { DEBUG } from '../constants/debug';

import GameConfig = Phaser.Types.Core.GameConfig


@Component({
  selector: 'app-qbirds',
  templateUrl: './qbirds.component.html',
  styleUrls: ['./qbirds.component.scss']
})
export class QBirdsComponent {


  public readonly phaser = Phaser;
  // main game configuration
  public readonly config: GameConfig = {
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



  /**
   * Instantiate application component.
   *
   * @param sceneService Scene service - this is an injectable Phaser.Scene sub-class.
   */
  public constructor() { }

  /**
   * On game ready event handler. Fired once Phaser game is ready and Angular view is initialized.
   *
   * @param game Game instance.
   */
  public onGameReady(game: Phaser.Game): void {
        
  }
}
