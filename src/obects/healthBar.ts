export class HealthBar extends Phaser.GameObjects.GameObject {
    health:Phaser.GameObjects.Image;
    x:number;
    y:number;
    width: number;
    heigth: number;
    scene: Phaser.Scene
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, 'health_bar')
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = height;
        this.scene = scene;

        const border = scene.textures.createCanvas('health_bar_border',width + 8,height + 8);
        border.context.fillStyle = "#000";
        border.context.lineWidth = 8;
        border.context.beginPath();
        border.context.rect(0,0,width + 8, height + 8);
        border.context.stroke();
        border.refresh();
        
        const texture = scene.textures.createCanvas('health_bar', width, height);
        const grd = texture.context.createLinearGradient(0, 0, width, 0);

        grd.addColorStop(0, '#ff5722');
        grd.addColorStop(1, '#81f100');

        texture.context.fillStyle = grd;
        texture.context.fillRect(0, 0, width, height);

        texture.refresh();
        this.scene.add.image(x,y,'health_bar_border').setDepth(100);
        this.health = this.scene.add.image(x,y ,'health_bar').setDepth(100);
    }

    updateHealth(value:number){
       
        this.health.setCrop(0,0,this.width*value/100,this.heigth);
    }

}
