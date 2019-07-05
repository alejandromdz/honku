import { Qbird } from '../objects/qbird';
import { NEST_DATA } from '../objects/nestData';
import { Worm } from '../objects/worm';


export class GameScene extends Phaser.Scene {

    private player: Qbird;
    private nest: Phaser.Geom.Polygon;
    private NPCList:Qbird[]=[]

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
            key: 'qbird',
            isPlayer: true
        }).setScale(2.5);
        

        this.NPCList.push( 
            new Qbird({
                x:300,
                y:400,
                scene: this,
                key: 'qbird'
            }).setScale(2.5).setTint(0xaaaa00),
            new Qbird({
                x:600,
                y:400,
                scene: this,
                key: 'qbird'
            }).setScale(2.5).setTint(0xaa00aa)
        )

        const worm = new Worm({
            x:250,
            y:260,
            scene: this,
            key:'worm'
        }).setScale(2);

        this.nest= new Phaser.Geom.Polygon(
            NEST_DATA.reduce((prev,curr)=> [...prev,curr.x,curr.y],[])
        )
        
        this.add.sprite(400, 300, 'leaves').setScale(4);

    }

    update(): void {
        try{
            this.player.update();
            this.NPCList.forEach(npc=>npc.update());
            [this.player,...this.NPCList].forEach(qbird=>{
                if(!qbird.isAlive()){
                    return;
                }
                if(!this.nest.contains(qbird.feet.position.x, qbird.feet.position.y))
                {
                    qbird.gotHit();
                }
            })
        }catch(e){
        }
    }
}