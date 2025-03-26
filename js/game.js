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
        // Laser: Simple red line
        this.textures.generate('laser', { data: ['1'], pixelWidth: 10, pixelHeight: 2, palette: { 0: '#0000', 1: '#ff0000' } }); // Red laser
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
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Create a group for lasers
        this.lasers = this.physics.add.group({
            defaultKey: 'laser',
            maxSize: 10 // Limit the number of lasers on screen
        });

        // Add mouse input listener for shooting
        this.input.on('pointerdown', (pointer) => {
            this.shootLaser();
        });
    }

    shootLaser() {
        const laser = this.lasers.get(this.player.x, this.player.y);
        if (laser) {
            laser.setActive(true);
            laser.setVisible(true);
            laser.body.setAllowGravity(false); // Lasers ignore gravity

            const laserSpeed = 400;
            // Shoot in the direction the player is facing
            if (this.player.flipX) { // Facing left
                laser.setVelocityX(-laserSpeed);
            } else { // Facing right
                laser.setVelocityX(laserSpeed);
            }

            // Optional: Destroy laser after some time or distance
            this.time.delayedCall(1000, () => {
                if (laser.active) {
                    this.lasers.killAndHide(laser);
                }
            });
        }
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

        // Jump - Allow Up arrow or Spacebar (Re-checking logic)
        if ((this.cursors.up.isDown || this.spacebar.isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-300); // Apply upward velocity for jump
        }

        // Optional: Clean up lasers that go off-screen (if not using timed kill)
        this.lasers.children.each(laser => {
            if (laser.active && (laser.x < 0 || laser.x > this.physics.world.bounds.width)) {
                this.lasers.killAndHide(laser);
            }
        });
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
