import { DEBUG } from "../constants/debug";

export class Enemy extends Phaser.GameObjects.Sprite {


    private key: string;
    private direction: number = 1;
    private speed: number = 1;
    private debugText: Phaser.GameObjects.Text;
    


    constructor(params) {

        super(params.scene, params.x, params.y, params.key);
        this.key = params.key;
        this.setOrigin(0, 0);
        this.setFrame(0);
        params.scene.add.existing(this);
        params.scene.physics.world.enable(this);

        (this.body as Phaser.Physics.Arcade.Body).setSize(10, 35);
        (this.body as Phaser.Physics.Arcade.Body).offset.setTo(15, 35);

        this.scene.anims.create({
            key: 'fly-x-enemy',
            frames: this.scene.anims.generateFrameNumbers(this.key, { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.setScale(2.5);
        this.play('fly-x-enemy');
        this.setFlipX(false);
        this.setDepth(10);
        this.debugText = this.scene.add.text(0, 0, '');
    }

    update(): void {
        this.x += this.direction * this.speed;
        if (this.x > (800 + this.width) || this.x < (0 - this.width*2)) {
            this.visible = false;
            this.debugText.visible = false;
            return;
        }
        else {
            this.visible = true;
            this.debugText.visible = true;
        }
        if (DEBUG) {

            this.debugText.setX(this.x);
            this.debugText.setY(this.y);
            this.debugText.setText(`
            x: ${Math.floor(this.x)}
            y: ${this.y}
            speed: ${this.speed}
    `)
        }

    }

    setDirection(direction: number) {
        this.direction = direction;
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

}