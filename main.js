var game;
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
var ball;

window.onload = function() {

	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

	function preload() {

		game.load.image('ball','assets/sprites/shinyball.png');

	}

	function create() {

		// setup game physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.restitution = 0.8;
		game.physics.p2.setImpactEvents(true);

		// setup collision groups
		var snakeCollisionGroup = game.physics.p2.createCollisionGroup();
		var ballCollisionGroup = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup();

		// add the ball
		ball = game.add.sprite(400, 300, 'ball');
		ball.anchor.setTo(0.5, 0.5);
		game.physics.p2.enable(ball);
		ball.body.setCollisionGroup(ballCollisionGroup);
		ball.body.collides([snakeCollisionGroup]);

		// add the snake head
		snakeHead = game.add.sprite(100, 300, 'ball');
		snakeHead.anchor.setTo(0.5, 0.5);
		game.physics.p2.enable(snakeHead);

		snakeHead.body.fixedRotation = true;
		snakeHead.body.setCollisionGroup(snakeCollisionGroup);
		snakeHead.body.collides(ballCollisionGroup, hitBall, this);

		//  add the snake body
		for (var i = 1; i < numSnakeSections; i++)
		{
			snakeSection[i] = game.add.sprite(100, 300, 'ball');
			snakeSection[i].anchor.setTo(0.5, 0.5);
		}

		//  init the snake path array
		for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
		{
			snakePath[i] = new Phaser.Point(100, 300);
		}

		// init the body movement (trails after the head)
		bodyMover = game.time.create(false);
		bodyMover.loop(Phaser.Timer.SECOND/25, moveSnake, this);
		bodyMover.start();

		// init keyboard cursors
		cursors = game.input.keyboard.createCursorKeys();

		// init the pause button using spacebar
		pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

		pauseButton.onDown.add(pauseGame, game);

		// start the snake
		game.time.events.add(Phaser.Timer.SECOND, startSnake, this);
	}

	function update() {
		// reset the velocity of the snake on keypress
		snakeHead.body.setZeroVelocity();

		if (isPaused) {
			return false;
		}

		if (cursors.up.isDown) {
			snakeHead.body.moveUp(50);
		} else if (cursors.down.isDown) {
			snakeHead.body.moveDown(50);
		} else if (cursors.left.isDown) {
			snakeHead.body.moveLeft(50);
		} else if (cursors.right.isDown) {
			snakeHead.body.moveRight(50);
		}
	}

	function startSnake() {
		console.log("snake should start startSnake");
		snakeHead.body.moveDown(400);
	}

	function hitBall() {
		console.log("hit the ball");
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

		for (var i = 1; i < numSnakeSections; i++)
		{
			snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
			snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
		}
	}

	function render() {

		game.debug.spriteInfo(snakeHead, 32, 32);

	}

	function buildSnake() {

	}
};

