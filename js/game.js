// Define a simple scene
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log("BootScene preload");
        // Load placeholder assets (simple colored rectangles)
        // We use textures.generate to create these dynamically
        this.textures.generate('player', { data: ['1'], pixelWidth: 32, pixelHeight: 48, palette: { 0: '#000', 1: '#ff0000' } }); // Red rectangle for player
        this.textures.generate('platform', { data: ['1'], pixelWidth: 100, pixelHeight: 20, palette: { 0: '#000', 1: '#00ff00' } }); // Green rectangle for platform
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

        // Add a placeholder player
        this.player = this.physics.add.sprite(100, 450, 'player'); // Positioned on the left, above platform
        this.player.setBounce(0.2); // Slight bounce on landing
        this.player.setCollideWorldBounds(true); // Prevent falling off screen edges (for now)

        // Add collision between player and platform
        this.physics.add.collider(this.player, platform);

        // Add keyboard input listeners
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Basic player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            // Add running animation later
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            // Add running animation later
        } else {
            this.player.setVelocityX(0);
            // Add idle animation later
        }

        // Basic jump
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-250); // Adjusted jump velocity
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
