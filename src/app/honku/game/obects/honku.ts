

import Key = Phaser.Input.Keyboard.Key;
const SPEED: number = 2;

export class Honku extends Phaser.GameObjects.Sprite {
    
    private controls: { UP: Key[], DOWN: Key[], LEFT: Key[], RIGHT: Key[] };
    private health: number = 100;
    private isDying: boolean = false;


    constructor(params) {

        super(params.scene, params.x, params.y, params.key);
        const key = params.key;

        this.setOrigin(0, 0);
        this.setFrame(0);
        
        params.scene.add.existing(this);
        params.scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        (this.body as Phaser.Physics.Arcade.Body).setSize(30, 30);
        (this.body as Phaser.Physics.Arcade.Body).offset.setTo(5, 5);

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
            key: 'fly-x',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'fly-xy',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 3, end: 5, }),
            frameRate: 10,
            repeat: -1,
        });

        this.scene.anims.create({
            key: 'fly-y',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 6, end: 8, }),
            frameRate: 10,
            repeat: -1,
        });

        this.scene.anims.create({
            key: 'fly-y-b',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 9, end: 11, }),
            frameRate: 10,
            repeat: -1,
        });

        this.scene.anims.create({
            key: 'killed',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 12, end: 15, }),
            frameRate: 5,
            repeat: -1
        });

        this.setScale(1.7);
        this.play('fly-y')
        this.setFlipX(false)
    }

    gotHit(): void {


        (this.body as Phaser.Physics.Arcade.Body).stop();
        this.anims.play('killed', true);
        this.isDying = true;
    }


    isAlive(): boolean{
        return !this.isDying;
    }

    update(): void {

        if (this.isDying) {
            return
        }


        if(this.controls.DOWN.find(k=>k.isDown) 
            || this.controls.UP.find(k=>k.isDown) 
            || this.controls.LEFT.find(k=>k.isDown) 
            || this.controls.RIGHT.find(k=>k.isDown)){
                //console.log('controls;')
                this.health = this.health > 10 ? this.health - 0.1 : this.health;
            } else {
                this.health  = this.health < 100 ? this.health + 0.1 : this.health;
            }


        const sqrt1_2_speed = (Math.SQRT1_2)*this.health*SPEED / 100;
        const unit_speed = this.health*SPEED/100;

        if (this.controls.UP.find(k => k.isDown) && this.controls.RIGHT.find(k => k.isDown)) {

            this.y -= sqrt1_2_speed;
            this.x += sqrt1_2_speed;
            this.play('fly-xy', true);
            this.setFlipY(false);
            this.setFlipX(false);
            return;
        }

        if (this.controls.DOWN.find(k => k.isDown) && this.controls.RIGHT.find(k => k.isDown)) {
            this.y += sqrt1_2_speed;
            this.x += sqrt1_2_speed;
            this.play('fly-x', true);
            this.setFlipY(false);
            this.setFlipX(false);
            return;
        }

        if (this.controls.UP.find(k => k.isDown) && this.controls.LEFT.find(k => k.isDown)) {
            this.y -= sqrt1_2_speed;
            this.x -= sqrt1_2_speed;
            this.play('fly-xy', true);
            this.setFlipY(false);
            this.setFlipX(true);
            return;
        }

        if (this.controls.DOWN.find(k => k.isDown) && this.controls.LEFT.find(k => k.isDown)) {
            this.y += sqrt1_2_speed;
            this.x -= sqrt1_2_speed;
            this.play('fly-x', true);
            this.setFlipY(false);
            this.setFlipX(true);
            return;
        }

        if (this.controls.UP.find(k => k.isDown)) {
            this.y -= unit_speed;
            this.play('fly-y', true)
            this.setFlipY(false);
            this.setFlipX(false);
            return;

        }
        if (this.controls.DOWN.find(k => k.isDown)) {
            this.y += unit_speed;
            this.play('fly-y-b', true)
            this.setFlipY(false);
            this.setFlipX(false);
            return;
        }

        if (this.controls.LEFT.find(k => k.isDown)) {
            this.x -= unit_speed;
            this.play('fly-x', true)
            this.setFlipY(false);
            this.setFlipX(true)
            return;
        }
        if (this.controls.RIGHT.find(k => k.isDown)) {
            this.x += unit_speed;
            this.play('fly-x', true)
            this.setFlipY(false);
            this.setFlipX(false)
            return;
        }
    }

    getHealth(): number{
        return this.health
    }

    

}