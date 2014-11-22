var game;
window.onload = function() {

//	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create }, true);
//
//	function preload () {
//
//		//game.load.image('logo', 'phaser.png');
//
//	}
//
//	function create() {
//
////		var button = game.add.button(game.world.centerX, game.world.centerY, onPlayAction, this);
//
//		var shape = game.add.graphics(0, 0);
//
//		shape.lineStyle(2, 0x00FF00, 1);
//		shape.beginFill(0x345555, 1);
//
//		shape.drawRect(100,100,100,100);
//
//
//		var playText = game.add.text(100, 100, 'Play', { font: "65px Arial", fill: "#ff0044", align: "center" });
//
//		if (Phaser.Keyboard(this).isDown(Phaser.Keyboard.LEFT)) {
//			shape.ani
//		}
//	}
//
//
//	function onPlayAction() {
//		console.log('button is pressed')
//	}


	// Twitter: @pato_reilly Web: http://patricko.byethost9.com

	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

	function preload() {

		game.load.image('ball','assets/sprites/shinyball.png');

	}

	var snakeHead; //head of snake sprite
	var snakeSection = new Array(); //array of sprites that make the snake body sections
	var snakePath = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
	var numSnakeSections = 4; //number of snake body sections
	var snakeSpacer = 14; //parameter that sets the spacing between sections
	var cursors;
	var bodyMover;
	var isPaused = false;
	var pauseButton;
	var storedVelocity = {x: 0, y: 0};

	function create() {

		game.physics.startSystem(Phaser.Physics.P2JS);

		cursors = game.input.keyboard.createCursorKeys();

		snakeHead = game.add.sprite(400, 300, 'ball');
		snakeHead.anchor.setTo(0.5, 0.5);

		game.physics.p2.enable(snakeHead);

		//  Init snakeSection array
		for (var i = 1; i <= numSnakeSections-1; i++)
		{
			snakeSection[i] = game.add.sprite(400, 300, 'ball');
			snakeSection[i].anchor.setTo(0.5, 0.5);
		}

		//  Init snakePath array
		for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
		{
			snakePath[i] = new Phaser.Point(400, 300);
		}

		bodyMover = game.time.create(false);
		bodyMover.loop(Phaser.Timer.SECOND/25, moveSnake, this);
		bodyMover.start();

		pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

		pauseButton.onDown.add(pauseGame, game);
	}

	function update() {

		if (cursors.up.isDown) {
			snakeHead.body.setZeroVelocity();
			snakeHead.body.moveUp(50);
		} else if (cursors.down.isDown) {
			snakeHead.body.setZeroVelocity();
			snakeHead.body.moveDown(50);
		} else if (cursors.left.isDown) {
			snakeHead.body.setZeroVelocity();
			snakeHead.body.moveLeft(50);
		} else if (cursors.right.isDown) {
			snakeHead.body.setZeroVelocity();
			snakeHead.body.moveRight(50);
		}
	}

	function pauseGame() {
		if (isPaused) {
			snakeHead.body.velocity.y = storedVelocity.y;
			snakeHead.body.velocity.x = storedVelocity.x;
			bodyMover.resume();
			isPaused = false;
		} else {
			storedVelocity.y = snakeHead.body.velocity.y;
			storedVelocity.x = snakeHead.body.velocity.x;
			snakeHead.body.setZeroVelocity();
			bodyMover.pause();
			isPaused = true;
		}
	}

	function moveSnake() {
		// Everytime the snake head moves, insert the new location at the start of the array,
		// and knock the last position off the end

		var part = snakePath.pop();

		part.setTo(snakeHead.x, snakeHead.y);

		snakePath.unshift(part);

		for (var i = 1; i <= numSnakeSections - 1; i++)
		{
			snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
			snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
		}
	}

	function render() {

		game.debug.spriteInfo(snakeHead, 32, 32);

	}
};

