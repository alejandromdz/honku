import { Qbird } from '../objects/qbird';
import { NEST_DATA } from '../objects/nestData';

export class GameScene extends Phaser.Scene {

    private player: Qbird;
    private debugtext:any;

    constructor() {
        super({
            key: "GameScene"
        })
    }

    preload(): void {
        this.load.image("clouds", "./assets/backgrounds/qbirds/clouds.png");
        this.load.image("trees", "./assets/backgrounds/qbirds/trees.png");
        this.load.image("nest", "./assets/backgrounds/qbirds/nest.png");
        this.load.image("leaves", "./assets/backgrounds/qbirds/leaves.png");
       
    }

    create(): void {

        this.add.sprite(400, 300, "clouds").setScale(4);
        this.add.sprite(400, 300, "trees").setScale(4);
        this.add.sprite(400, 300, "nest").setScale(4);

        this.player = new Qbird({
            x: 400,
            y: 400,
            scene: this,
            key: 'qbird'
        }).setScale(2.5);


           
        this.matter.add.fromVertices(
            420,
            378,
            NEST_DATA,
            {isStatic:true, isSensor: true},true);
        
    
            
        //this.add.sprite(400, 300, "leaves").setScale(4);

        this.debugtext = this.add.text(10, 10, '', { fill: '#fff' });

        this.matter.world.on("collisionend", event => {
            event.pairs.forEach(pair => {
              const { bodyA, bodyB } = pair;
              console.log(bodyA,bodyB);
            });
          });

    }

    update(): void {
        this.player.update();
        var pointer: Phaser.Input.Pointer = this.input.activePointer;

    this.debugtext.setText([
        'x: ' + pointer.position.x,
        'y: ' + pointer.position.y,
        'isDown: ' + pointer.isDown,
        'rightButtonDown: ' + pointer.rightButtonDown()
    ]);
    }

}