

export class BootScene extends Phaser.Scene {
  
  private phaserSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image("logo", "./assets/honku_title.png");
    // load our package
    this.load.pack(
      "preload",
      "./assets/pack.json",
      "preload"
    );

  }

  create(): void {
    this.phaserSprite = this.add.sprite(400, 300, "logo").setScale(2);


    this.add.bitmapText(
      40, 
      50, 
      'font',
      'Honku', 
     )
     .setTint(0x900d0d)
     .setFontSize(40);

          this.add.bitmapText(
            50, 
            150, 
            'font',
            'dev:alejandromdz@gmail.com', 
           )
           .setTint(0xe9ebf1).setFontSize(16)

    setTimeout(()=>{
      this.scene.start("GameScene")
    }, 5000)
  }

  init():void{
  }
}
