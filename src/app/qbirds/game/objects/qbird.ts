

import Key = Phaser.Input.Keyboard.Key;
import * as MatterJS from 'matter-js';
// @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
const Matter: typeof MatterJS = Phaser.Physics.Matter.Matter;

const FRC_MAGNITUDE = 0.001;

export class Qbird extends Phaser.Physics.Matter.Sprite {
    
    private controls: { UP: Key[], DOWN: Key[], LEFT: Key[], RIGHT: Key[] };
    private isDying: boolean = false;
    public isPlayer: boolean = false;
    public feet;
    public grow: number = 2;
    public weight: number = 5;

    constructor(params) {

        super(params.scene.matter.world, params.x, params.y, params.key);
        const { key, isPlayer, x, y } = params;
        this.isPlayer = isPlayer

        this.setOrigin(0, 0);
    
        const { Bodies, Body } = Matter;
        
        const { width: w, height: h } = this;
        const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, 
            {   label: 'qbird', 
                chamfer: { 
                    radius: 10 
                } 
            })
        
        this.feet = Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { 
            isSensor: true, 
            label: 'feet' });
        
        const compoundBody = Body.create({
            parts: [mainBody, this.feet],
            frictionStatic: 0.05,
            frictionAir: 0.1,
            friction: 0.2
          });
        
        
        this.setExistingBody(compoundBody);
        this.setPosition(x, y)
        this.setScale(this.grow);
        this.setMass(this.weight);
        compoundBody.inertia = Infinity;
        compoundBody.inverseInertia = 0;
        this.scene.add.existing(this);


        this.controls = {
            UP: [
                this.scene.input.keyboard.addKey('UP'),
                this.scene.input.keyboard.addKey('W'),
                this.scene.input.keyboard.addKey('EIGHT')
            ],
            DOWN: [
                this.scene.input.keyboard.addKey('DOWN'),
                this.scene.input.keyboard.addKey('S'),
                this.scene.input.keyboard.addKey('TWO')
            ],
            LEFT: [
                this.scene.input.keyboard.addKey('LEFT'),
                this.scene.input.keyboard.addKey('A'),
                this.scene.input.keyboard.addKey('FOUR')
            ],
            RIGHT: [
                this.scene.input.keyboard.addKey('RIGHT'),
                this.scene.input.keyboard.addKey('D'),
                this.scene.input.keyboard.addKey('SIX')
            ]
        };

        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'killed',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 2, end: 2 }),
            frameRate: 1,
            repeat: -1
        });

        this.play('walk')
        this.setFlipX(false)

    }

    gotHit(): void {
        this.play('killed', true);
        this.isDying = true;
    }

    isAlive(): boolean{
        return !this.isDying;
    }

    update(): void {

        if (this.isDying) {
            this.setMass(2)
            this.move(Math.PI/2);
            return;
        }

        if(!this.isPlayer){
            return;
        }
        
        if (this.controls.UP.find(k => k.isDown) && this.controls.RIGHT.find(k => k.isDown)) {
            this.move(-Math.PI/4)
            return;
        }

        if (this.controls.DOWN.find(k => k.isDown) && this.controls.RIGHT.find(k => k.isDown)) {
            this.move(Math.PI/4)
            return;
        }

        if (this.controls.UP.find(k => k.isDown) && this.controls.LEFT.find(k => k.isDown)) {
            this.move(-3*Math.PI/4)
            return;
        }

        if (this.controls.DOWN.find(k => k.isDown) && this.controls.LEFT.find(k => k.isDown)) {
            this.move(3*Math.PI/4)
            return;
        }

        if (this.controls.UP.find(k => k.isDown)) {
            this.move(-Math.PI/2)
            return;

        }
        if (this.controls.DOWN.find(k => k.isDown)) {
            this.move(Math.PI/2)
            return;
        }

        if (this.controls.LEFT.find(k => k.isDown)) {
            this.move(Math.PI)
            return;
        }
        if (this.controls.RIGHT.find(k => k.isDown)) {
            this.move(0)
            return;
        }
    }

    move(ang:number){
     this.applyForce(
         new Phaser.Math.Vector2(
            FRC_MAGNITUDE*this.weight*Math.cos(ang),
            FRC_MAGNITUDE*this.weight*Math.sin(ang) 
        ));

        if(-Math.PI/2 < ang && ang < Math.PI/2){
            this.setFlipX(true);
        }
        else{
            this.setFlipX(false);
        }
    }
}