import { Qbird } from '../objects/qbird';

export class GameScene extends Phaser.Scene {

    private player: Qbird;

    constructor() {
        super({
            key: "GameScene"
        })
    }

    preload() {
        this.load.image("clouds", "./assets/backgrounds/clouds.png");
        this.load.image("trees", "./assets/backgrounds/trees.png");
        this.load.image("nest", "./assets/backgrounds/nest.png");
        this.load.image("leaves", "./assets/backgrounds/leaves.png");
    }

    create() {

        this.add.sprite(400, 300, "clouds").setScale(4);
        this.add.sprite(400, 300, "trees").setScale(4);
        this.add.sprite(400, 300, "nest").setScale(4);

        this.player = new Qbird({
            x: 400,
            y: 400,
            scene: this,
            key: 'qbird'
        }).setScale(2.5);

        this.add.sprite(400, 300, "leaves").setScale(4);
    }
    update(): void {
        this.player.update();
    }

}