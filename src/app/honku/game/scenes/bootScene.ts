


import * as Phaser from "phaser";


export class BootScene extends Phaser.Scene {

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
    this.add.sprite(400, 300, "logo").setScale(2);


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
            '2019', 
           )
           .setTint(0xe9ebf1).setFontSize(16)

    setTimeout(()=>{
      try{

        this.scene.start("GameScene")
      }
      catch(err){
        
      }
    }, 5000)
  }

  init():void{
  }
}
