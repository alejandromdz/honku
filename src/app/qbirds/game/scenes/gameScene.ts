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

        const nestBoundaries = this.physics.add.group();

        var polygon = new Phaser.Geom.Polygon([
            ...NEST_DATA.map(point=>new Phaser.Geom.Point(point.x,point.y))
        ]);
        
        var graphics = this.add.graphics({ x: 0, y: 0 });
        graphics.lineStyle(2, 0x00aa00);
        graphics.beginPath();
        graphics.moveTo(polygon.points[0].x, polygon.points[0].y);
    
        nestBoundaries.add(graphics);

        for (var i = 1; i < polygon.points.length; i++)
        {
            graphics.lineTo(polygon.points[i].x, polygon.points[i].y);
        }
    
        graphics.closePath();
        graphics.strokePath();

        this.physics.add.collider(this.player,nestBoundaries,()=>{
            console.log('collided')
        })    
        //this.add.sprite(400, 300, "leaves").setScale(4);

        this.debugtext = this.add.text(10, 10, '', { fill: '#fff' });

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