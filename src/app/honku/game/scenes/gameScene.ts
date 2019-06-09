
import { Honku } from '../obects/honku';
import { Enemy } from '../obects/enemy';
import { ENEMY_DATA } from '../constants/enemyData';
import { DEBUG } from '../constants/debug';
import { HealthBar } from '../obects/healthBar';
import 'whatwg-fetch';

const RANKS={
    1:'1ST',
    2:'2ND',
    3:'3RD',
    4:'4TH',
    5:'5TH'
}

export class GameScene extends Phaser.Scene {

    private player: Honku;

    private scoreText: Phaser.GameObjects.BitmapText;
    private enemies : Phaser.GameObjects.Group
    private baseLayers: Phaser.GameObjects.Group;
    private cloudLayers: Phaser.GameObjects.Group;
    private healthBar: HealthBar;
    private score: number = 0;
    private name: string = '';
    private chars:string[][] = [];
    private playerText: Phaser.GameObjects.BitmapText;
    private rank: Phaser.GameObjects.BitmapText;

    private cursor:Phaser.Math.Vector2;
    private block;
    private text;
    private charLimit =3;
    private runOnce = false;
    private submitted = false;


    constructor() {
        super({
            key: "GameScene"
        });

        this.chars = [
            [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
            [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
            [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
        ];

        this.cursor = new Phaser.Math.Vector2();
        this.text;
        this.block;
        this.name = '';
        this.charLimit = 3;
    }

    preload(): void {
        this.load.image('tiles', 'assets/tiles/terrain_atlas.png');
        this.load.image('cloud_tiles', 'assets/tiles/clouds.png');
        this.load.tilemapTiledJSON('map', 'assets/tiles/level_1.json'); 
        this.load.tilemapTiledJSON('clouds_map', 'assets/tiles/level_1_clouds.json');      

        //keyboard

        this.load.image('block', 'assets/input/block.png');
        this.load.image('rub', 'assets/input/rub.png');
        this.load.image('end', 'assets/input/end.png');
        this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');

    }

    create(): void {
        const map = this.make.tilemap({ key: 'map' });
        const clouds = this.make.tilemap({ key: 'clouds_map' });

        const tileset = map.addTilesetImage('terrain_atlas', 'tiles');
        const clouds_tileset = clouds.addTilesetImage('clouds', 'cloud_tiles');

        this.baseLayers= this.add.group();
        this.cloudLayers= this.add.group();
        
        this.baseLayers.add( map.createStaticLayer('Base', tileset, 0, this.game.scale.height - map.heightInPixels));
        this.baseLayers.add( map.createStaticLayer('Map', tileset, 0, this.game.scale.height - map.heightInPixels));
        this.baseLayers.add( map.createStaticLayer('Rocks', tileset, 0, this.game.scale.height - map.heightInPixels));
        this.baseLayers.add( map.createStaticLayer('Trees', tileset, 0, this.game.scale.height - map.heightInPixels));
        
        this.player = new Honku({ 
            x: 400, 
            y: 400, 
            scene: this, 
            key: 'honku'
        });

        this.enemies = this.physics.add.group({
            runChildUpdate: true
          });
        
        ENEMY_DATA.forEach(data => {
            this.time.delayedCall(data.delay*1000,()=>{
                if(!this.player.isAlive()){
                    return;
                }
                // 400 - 500 * data.direction puts the enemy out of the screen
                const enemy = new Enemy({
                    x:(400 - 600 * data.direction), 
                    y: data.y, 
                    scene:this, 
                    key: 'enemy'
                });
                enemy.setSpeed(data.speed);
                enemy.setDirection(data.direction);
                this.enemies.add(enemy);
            },null,null)
        });

        this.cloudLayers.add( clouds.createStaticLayer('Clouds', clouds_tileset, 0, this.game.scale.height - clouds.heightInPixels ));
        this.cloudLayers.setDepth(20,1);

        this.scoreText = this.add.bitmapText(10, 10,'arcade',`SCORE`).setTint(0xffffff)
        .setDepth(100)
        .setFontSize(16)
    
        this.physics.add.overlap(
            this.player,
            this.enemies,
            (player: Honku, enemies) => {
                if (DEBUG || this.runOnce) {
                    return;
                }
               player.gotHit();
               

//GAME OVER
let text = this.add.bitmapText(130, 50, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-').setDepth(100);

text.setLetterSpacing(20);
text.setInteractive();

this.add.image(text.x + 430, text.y + 148, 'rub').setDepth(100);
this.add.image(text.x + 482, text.y + 148, 'end').setDepth(100);

this.block = this.add.image(text.x - 10, text.y - 2, 'block').setOrigin(0).setDepth(100);

this.text = text;
this.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
this.input.keyboard.on('keyup_FOUR', this.moveLeft, this);

this.input.keyboard.on('keyup_RIGHT', this.moveRight, this);
this.input.keyboard.on('keyup_SIX', this.moveRight, this);

this.input.keyboard.on('keyup_UP', this.moveUp, this);
this.input.keyboard.on('keyup_EIGHT', this.moveUp, this);

this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
this.input.keyboard.on('keyup_TWO', this.moveDown, this);

this.input.keyboard.on('keyup_ENTER', this.pressKey, this);
this.input.keyboard.on('keyup_SPACE', this.pressKey, this);
this.input.keyboard.on('keyup', this.anyKey, this);

text.on('pointermove', this.moveBlock, this);
text.on('pointerup', this.pressKey, this);

this.add.bitmapText(
    100, 
    260, 
    'arcade',
    'RANK  NAME   SCORE'
    )
    .setTint(0xffffff)
    .setDepth(100);

this.rank = this.add.bitmapText(
    100, 
    310, 
    'arcade', 
    `             ${Math.floor(this.score/10)}`
    )
    .setTint(0xffffff)
    .setDepth(100);


this.playerText = this.add.bitmapText(290, 310, 'arcade', '').setTint(0xffffff).setDepth(100);
//  Listen to events from the Input Panel scene
this.events.on('updateName', this.updateName, this);
this.events.on('submitName', this.submitName, this);

this.runOnce = true;
//GAME OVER

    
            },
            null,
            this
        );

        this.healthBar = new HealthBar(this,680,18,128,16);
        
    }

    update(): void {
        if(!this.player.isAlive()) {
            this.enemies.runChildUpdate = false;
            return;
        }
        this.player.update();
        
        Phaser.Actions.IncY(this.baseLayers.getChildren(),0.4);
        Phaser.Actions.IncY(this.cloudLayers.getChildren(),0.6);

        if (this.scoreText) {
            this.scoreText.setText(`SCORE ${Math.floor(++this.score / 10)}`);
        }
        this.healthBar.updateHealth(this.player.getHealth());

    }

    moveBlock (pointer, x, y)
    {
        let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
        let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
        let char = this.chars[cy][cx];

        this.cursor.set(cx, cy);

        this.block.x = this.text.x - 10 + (cx * 52);
        this.block.y = this.text.y - 2 + (cy * 64);
    }

    moveLeft ()
    {
        if (this.cursor.x > 0)
        {
            this.cursor.x--;
            this.block.x -= 52;
        }
        else
        {
            this.cursor.x = 9;
            this.block.x += 52 * 9;
        }
    }

    moveRight ()
    {
        if (this.cursor.x < 9)
        {
            this.cursor.x++;
            this.block.x += 52;
        }
        else
        {
            this.cursor.x = 0;
            this.block.x -= 52 * 9;
        }
    }

    moveUp ()
    {
        if (this.cursor.y > 0)
        {
            this.cursor.y--;
            this.block.y -= 64;
        }
        else
        {
            this.cursor.y = 2;
            this.block.y += 64 * 2;
        }
    }

    moveDown ()
    {
        if (this.cursor.y < 2)
        {
            this.cursor.y++;
            this.block.y += 64;
        }
        else
        {
            this.cursor.y = 0;
            this.block.y -= 64 * 2;
        }
    }

    anyKey (event)
    {
        //  Only allow A-Z . and -

        let code = event.keyCode;

        if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD)
        {
            this.cursor.set(6, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS)
        {
            this.cursor.set(7, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE)
        {
            this.cursor.set(8, 2);
            this.pressKey();
        }
        else if (code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z)
        {
            code -= 65;

            let y = Math.floor(code / 10);
            let x = code - (y * 10);

            this.cursor.set(x, y);
            this.pressKey();
        }
    }

    pressKey ()
    {
        let x = this.cursor.x;
        let y = this.cursor.y;
        let nameLength = this.name.length;

        this.block.x = this.text.x - 10 + (x * 52);
        this.block.y = this.text.y - 2 + (y * 64);

        if (x === 9 && y === 2 && nameLength > 0)
        {
            //  Submit
            this.events.emit('submitName', this.name);
        }
        else if (x === 8 && y === 2 && nameLength > 0)
        {
            //  Rub
            this.name = this.name.substr(0, nameLength - 1);

            this.events.emit('updateName', this.name);
        }
        else if (this.name.length < this.charLimit)
        {
            //  Add
            this.name = this.name.concat(this.chars[y][x]);

            this.events.emit('updateName', this.name);
        }
    }
    
    submitName ()
    {

        if(this.submitted){
            return;
        }

        this.submitted = true;

           fetch('https://blqeonyy0f.execute-api.ap-southeast-1.amazonaws.com/v1/score', 
            {
                method: 'POST',
                body: JSON.stringify({
                    score: Math.floor(this.score / 10),
                    name: this.name
                })
            })
            .then(() => {
                return fetch('https://blqeonyy0f.execute-api.ap-southeast-1.amazonaws.com/v1/score')
            })
            .then(res => res.json())
            .then(scores => {

                this.rank.setText('');
                this.playerText.setText('');
                scores.slice(0,5)
                .forEach((player,i)=>{
                    this.add.bitmapText(100, 310+50*i, 'arcade', `${RANKS[i+1]}   ${player.name}    ${
                        "  ".slice(0,3-(Math.floor(Math.log10(this.score))))
                    }${player.score}`).setTint(0xffffff).setDepth(100);
                });
                
            })

    }

    updateName (name)
    {
        this.playerText.setText(`${name}_`);
    }
}
