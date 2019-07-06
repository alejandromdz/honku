

import * as MatterJS from 'matter-js';

// @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
const Matter: typeof MatterJS = Phaser.Physics.Matter.Matter;

export class Worm extends Phaser.Physics.Matter.Sprite {

    isFalling:boolean;
    landPosition: {x:number, y:number};
    isDying = false;
    spriteScene;
    
    constructor(params){
        super(params.scene.matter.world, params.x, params.y, params.key);
        this.spriteScene = params.scene;
        

        this.isFalling = true;


        
        const { key , x, y } = params;
        const { width: w, height: h } = this;

        this.landPosition = {x, y};
        
        this.setOrigin(0, 0);
        this.setIgnoreGravity(true);
            
        const { Bodies } = Matter;

        const mainBody = Bodies.rectangle(0, 0, w * 0.3, h * 0.5,{isSensor: true, label: 'worm'});
       
        this.setExistingBody(mainBody);
        this.setPosition(x, 0);
        this.setDisplayOrigin(w * 0.5, h * 0.6);
        this.setScale(2);
        params.scene.add.existing(this);

        this.scene.anims.create({
            key: 'stay',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'falling',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 12, end: 12 }),
            frameRate: 10,
            repeat: -1
        });


        this.play('falling');

    }

    gotHit(){
        const particles = this.spriteScene.add.particles('particle');

        particles.createEmitter({
            alpha: { start: 1, end: 1 },
            scale: { start: 0.5, end: 2.5 },
            speed: 20,
            accelerationY: -100,
            angle: { min: -85, max: -95 },
            rotate: { min: -180, max: 180 },
            lifespan: { min: 90, max: 110 },
            blendMode: 'ADD',
            frequency: 5,
            maxParticles: 3,
            x: this.x,
            y: this.y
        });
        this.isDying = true;

        this.destroy();

    }

    isAlive(){
        return !this.isDying;
    }

    update(){

        if(!this.isFalling){
            return;
        }
        if(this.y< this.landPosition.y){
            this.y++;
        }
        else{
            this.y = this.landPosition.y;
            this.play('stay',true);
            this.isFalling = false;
        }

    }

}
