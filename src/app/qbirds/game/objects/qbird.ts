

import Key = Phaser.Input.Keyboard.Key;
import * as MatterJS from 'matter-js';
// @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
const Matter: typeof MatterJS = Phaser.Physics.Matter.Matter;
const SPEED: number = 2;

export class Qbird extends Phaser.Physics.Matter.Sprite {
    
    private controls: { UP: Key[], DOWN: Key[], LEFT: Key[], RIGHT: Key[] };
    private health: number = 100;
    private isDying: boolean = false;
    private isPlayer: boolean = false;
    public feet;

    constructor(params) {

        super(params.scene.matter.world, params.x, params.y, params.key);
        const { key, isPlayer, x, y } = params;
        this.isPlayer = isPlayer

        this.setOrigin(0, 0);
        this.setIgnoreGravity(true);
        
 
        const { Bodies, Body } = Matter;
        
        const { width: w, height: h } = this;
        const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, { chamfer: { radius: 10 } })
        
        this.feet = Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true, label: 'feet' });
        
        const compoundBody = Body.create({
            parts: [mainBody, this.feet],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.1
          });
        
        this.setExistingBody(compoundBody);
        this.setPosition(x, y)

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
            this.y+=2;
            return;
        }

        if(!this.isPlayer){
            return;
        }

        if(this.controls.DOWN.find(k=>k.isDown) 
            || this.controls.UP.find(k=>k.isDown) 
            || this.controls.LEFT.find(k=>k.isDown) 
            || this.controls.RIGHT.find(k=>k.isDown)){
                
                //this.health = this.health > 10 ? this.health - 0.1 : this.health;
            } else {
                //this.health  = this.health < 100 ? this.health + 0.1 : this.health;
            }
        
        const sqrt1_2_speed = (Math.SQRT1_2)*this.health*SPEED / 100;
        const unit_speed = this.health*SPEED/100;
        
        if (this.controls.UP.find(k => k.isDown) && this.controls.RIGHT.find(k => k.isDown)) {

            this.y -= sqrt1_2_speed;
            this.x += sqrt1_2_speed;
            this.play('walk', true);
            this.setFlipY(false);
            this.setFlipX(false);
            return;
        }

        if (this.controls.DOWN.find(k => k.isDown) && this.controls.RIGHT.find(k => k.isDown)) {
            this.y += sqrt1_2_speed;
            this.x += sqrt1_2_speed;
            this.play('walk', true);
            this.setFlipY(false);
            this.setFlipX(false);
            return;
        }

        if (this.controls.UP.find(k => k.isDown) && this.controls.LEFT.find(k => k.isDown)) {
            this.y -= sqrt1_2_speed;
            this.x -= sqrt1_2_speed;
            this.play('walk', true);
            this.setFlipY(false);
            this.setFlipX(true);
            return;
        }

        if (this.controls.DOWN.find(k => k.isDown) && this.controls.LEFT.find(k => k.isDown)) {
            this.y += sqrt1_2_speed;
            this.x -= sqrt1_2_speed;
            this.play('walk', true);
            this.setFlipY(false);
            this.setFlipX(true);
            return;
        }

        if (this.controls.UP.find(k => k.isDown)) {
            this.y -= unit_speed;
            this.play('walk', true);
            this.setFlipY(false);
            this.setFlipX(false);
            return;

        }
        if (this.controls.DOWN.find(k => k.isDown)) {
            this.y += unit_speed;
            this.play('walk', true);
            this.setFlipY(false);
            this.setFlipX(false);
            return;
        }

        if (this.controls.LEFT.find(k => k.isDown)) {
            this.x -= unit_speed;
            this.play('walk', true);
            this.setFlipY(false);
            this.setFlipX(true)
            return;
        }
        if (this.controls.RIGHT.find(k => k.isDown)) {
            this.x += unit_speed;
            this.play('walk', true);
            this.setFlipY(false);
            this.setFlipX(false)
            return;
        }
    }

    getHealth(): number{
        return this.health
    }

    

}