

import * as MatterJS from 'matter-js';

// @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
const Matter: typeof MatterJS = Phaser.Physics.Matter.Matter;

export class Worm extends Phaser.Physics.Matter.Sprite {
    
    constructor(params){
        super(params.scene.matter.world, params.x, params.y, params.key);
        
        const { key , x, y } = params;
        const { width: w, height: h } = this;
        
        this.setOrigin(0, 0);
        this.setIgnoreGravity(true);
            
        const { Bodies } = Matter;

        const mainBody = Bodies.rectangle(0, 0, w * 0.3, h * 0.5);
       
        this.setExistingBody(mainBody);
        this.setPosition(x, y);
        this.setDisplayOrigin(w * 0.5, h * 0.6);
        params.scene.add.existing(this);

        this.scene.anims.create({
            key: 'stay',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.play('stay');

    }
}
