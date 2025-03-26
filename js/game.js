// Define a simple scene
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log("BootScene preload");
        // Load placeholder assets
        // Player: A slightly more complex shape (like a basic stick figure)
        this.textures.generate('player', {
            data: [
                '.11.',
                '1111',
                '.11.',
                '1.11',
                '.1.1',
                '.1.1'
            ],
            pixelWidth: 8,
            pixelHeight: 8,
            palette: { 0: '#0000', 1: '#ffff00' } // Yellow player
        });
        // Platform: Brown rectangle
        this.textures.generate('platform', { data: ['1'], pixelWidth: 1, pixelHeight: 1, palette: { 0: '#0000', 1: '#a0522d' } }); // Brown platform
        // Background: Simple gradient or pattern later? For now, keep solid color in GameScene.
    }

    create() {
        console.log("BootScene create - starting GameScene");
        this.scene.start('GameScene'); // Start the main game scene
    }
}

// Define the main game scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        console.log("GameScene preload");
        // Assets are preloaded in BootScene
    }

    create() {
        console.log("GameScene create");
        // Set a background color for this scene
        this.cameras.main.setBackgroundColor('#87ceeb'); // Sky blue background

        // Add a placeholder platform
        const platform = this.physics.add.staticImage(400, 550, 'platform'); // Centered horizontally, near bottom
        platform.setScale(4, 1).refreshBody(); // Make it wider

        // Add a placeholder player - scale it up
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setScale(3); // Make the 8x8 sprite larger
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        // Since the generated texture is small, adjust the physics body size
        // We'll refine this when using actual sprites
        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.8);


        // Add collision between player and platform
        this.physics.add.collider(this.player, platform);

        // Add keyboard input listeners
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Player movement and basic animation (flipping)
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.setFlipX(true); // Flip sprite to face left
            // Add actual running animation later
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.setFlipX(false); // Normal sprite facing right
            // Add actual running animation later
        } else {
            this.player.setVelocityX(0);
            // Add idle animation later
        }

        // Basic jump
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-300); // Slightly stronger jump
        }
    }
}


// Phaser game configuration
const config = {
    type: Phaser.AUTO, // Automatically choose WebGL or Canvas
    width: 800,        // Game width in pixels
    height: 600,       // Game height in pixels
    parent: 'game-container', // ID of the div to contain the game
    physics: {
        default: 'arcade', // Use the Arcade Physics system
        arcade: {
            gravity: { y: 300 }, // Basic gravity for platforming
            gravity: { y: 350 }, // Slightly increased gravity
            debug: false        // Set to true to see physics bodies
        }
    },
    scene: [BootScene, GameScene] // Add both scenes to the game
};

// Create the game instance
const game = new Phaser.Game(config);

console.log("Phaser game initialized");
