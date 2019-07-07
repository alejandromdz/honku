import { Qbird } from '../objects/qbird';
import { NEST_DATA } from '../objects/nestData';
import { Worm } from '../objects/worm';
import { fromEvent, concat, of } from 'rxjs';
import { filter,  delay} from 'rxjs/operators';
import { WORM_DATA } from '../objects/wormData';

import * as MatterJS from 'matter-js';
import { QBirdNature } from '../objects/qbirdNature';
import { QBIRD_DATA } from '../objects/qbirdData';
// @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
const Matter: typeof MatterJS = Phaser.Physics.Matter.Matter;
const SAFE_DIST = 30;

export class GameScene extends Phaser.Scene {

    private player: Qbird;
    private nest: Phaser.Geom.Polygon;
    private NPCList: Qbird[] = [];
    private wormsList: Worm[] = [];
    private isGrowing = false;

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
        this.load.image("particle","./assets/particles/qbirds/particle.png");
    }

    create(): void {

        this.add.sprite(400, 300, "clouds").setScale(4).setDepth(0);
        this.add.sprite(400, 300, "trees").setScale(4).setDepth(100);
        this.add.sprite(400, 300, "nest").setScale(4).setDepth(200);

        this.player = new Qbird({
            x: 400,
            y: 400,
            scene: this,
            key: 'qbird',
            isPlayer: true
        }).setDepth(300);
        

        this.NPCList = QBIRD_DATA.map(qbird =>     
            (new Qbird({
                x:qbird.x,
                y:qbird.y,
                scene: this,
                key: 'qbird',
                nature: qbird.nature
            })
            .setTint(qbird.color)
            .setDepth(300))
        )

        WORM_DATA.forEach(data => {

            this.time.delayedCall(data.delay*1000,()=>{
                
                if(!this.player.isAlive()){
                    return;
                }
                
                const worm = new Worm({
                    x: data.x, 
                    y: data.y, 
                    scene:this, 
                    key: 'worm'
                }).setDepth(300);
                
                this.wormsList.push(worm);
            },null,null)
        });

        this.nest = new Phaser.Geom.Polygon(
            NEST_DATA.reduce((prev,curr)=> [...prev,curr.x,curr.y],[])
        )


        const wormQbirdCollision = fromEvent(this.matter.world, 'collisionstart')
            .pipe(
                filter((ev:any[]) => ev.find(e=>e.label=='worm')),
                filter((ev:any[]) => ev.find(e=>e.label=='qbird'))
        
            )

        wormQbirdCollision.subscribe(ev => {
            
            const worm:Worm = ev.find(e=>e.label=='worm').gameObject;
            const bird:Qbird = ev.find(e=>e.label=='qbird').gameObject;

            worm.gotHit();

            const currentScale = bird.grow;
            const newScale = currentScale + 0.5;
            const currentWeight = bird.weight;
            const newWeight = currentWeight + 5;
            this.isGrowing = true;
            this.anims.pauseAll();
            const growTimer = 150;

            concat(
                of(newScale).pipe(delay(growTimer)),
                of(currentScale).pipe(delay(growTimer)),
                of(newScale).pipe(delay(growTimer)),      
                of(currentScale).pipe(delay(growTimer)),
                of(newScale).pipe(delay(growTimer))
            ).subscribe((scale) => { 
                bird.setScale(scale);
            }, 
            ()=>{}, 
            ()=>{
                    bird.grow = newScale;
                    bird.weight = newWeight;
                    bird.setMass(newWeight);
                    (bird.body as typeof Matter.Body).inertia = Infinity;
                    (bird.body as typeof Matter.Body).inverseInertia = 0;
                    this.isGrowing = false;
                    this.anims.resumeAll();
                    
            })            
        })

        this.add.sprite(400, 300, 'leaves').setScale(4).setDepth(400);

    }

    update(): void {
        try{
            if(this.isGrowing){
                return;
            }

            this.player.update();
            this.NPCList.forEach(npc=>npc.update());
            this.wormsList.forEach(worm => worm.isAlive() ? worm.update() : null);

            [
                this.player,
                ...this.NPCList
            ].forEach((qbird,i,qbirdList) => {
                
                if(!qbird.isAlive()){
                    return;
                }

                if(!this.nest.contains(qbird.feet.position.x, qbird.feet.position.y))
                {
                    qbird.gotHit();
                    
                    if(qbird.y < 300){

                        qbird.setDepth(150)
                    }
                    return;
                }

                if(qbird.isPlayer){
                    return;
                }

                const activeWorms = this.wormsList.filter(worm => worm.active);
                const activeQbirds = qbirdList.filter(qbird => qbird.isAlive());
                
                if(activeWorms.length > 0){
                    const closest: Worm = activeWorms.reduce((prev,curr)=>{
                        
                        const dist = Math.hypot(
                            curr.landPosition.y-qbird.y, 
                            curr.landPosition.x-qbird.x
                            );
                        
                        if(dist < prev.dist){
                            prev = {
                                dist,
                                point:curr
                            }
                        }
                        return prev;
                    }, {point: null, dist: Infinity}).point;
                   
                    qbird.move(
                        Math.atan2(
                            closest.landPosition.y - qbird.y, 
                            closest.landPosition.x - qbird.x
                        ));

                } else if(activeQbirds.length > 0) {
                    const closest: Qbird = activeQbirds.reduce((prev,curr)=>{
                        
                        const dist = Math.hypot(
                            curr.y-qbird.y, 
                            curr.x-qbird.x
                            );
                        
                        if(0 < dist && dist < prev.dist){
                            prev = {
                                dist,
                                point:curr
                            }
                        }
                        return prev;
                    }, {point: null, dist: Infinity}).point;
                    
                    const closestAng : number =  Math.atan2(
                        closest.y - qbird.y, 
                        closest.x - qbird.x
                    );

                    const natureAng = qbird.nature == QBirdNature.EVASIVE ?
                    closestAng + Math.PI/2:
                    closestAng;

                    
                    const safeAng = !this.nest.contains(
                        qbird.feet.position.x + SAFE_DIST * Math.cos(natureAng), 
                        qbird.feet.position.y + SAFE_DIST * Math.sin(natureAng)) ?
                        natureAng + Math.PI :
                        natureAng

                    qbird.move(
                        safeAng
                       );
                }
            })

            
        }catch(e){
        }
    }
}