import { Qbird } from '../objects/qbird';
import { NEST_DATA } from '../objects/nestData';
import {  fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';


export class GameScene extends Phaser.Scene {

    private player: Qbird;

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


           
        const nest = this.matter.add.fromVertices(
            420,
            378,
            NEST_DATA,
            {isStatic:true, isSensor: true, label : 'nest'},true);
        
    
            
        this.add.sprite(400, 300, 'leaves').setScale(4);

        const nestFeetCollision = fromEvent(this.matter.world,'collisionend')
        .pipe(
            filter(ev=>ev[1].label == 'nest' || ev[2].label == 'nest'),
            filter(ev=>ev[1].label == 'feet' || ev[2].label == 'feet'),
        )
        nestFeetCollision.subscribe(ev=>{
            console.log('collision')
            this.player.gotHit();
        })

    }

    update(): void {
        this.player.update();
    }

}