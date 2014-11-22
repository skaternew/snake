var game;
var cursors;
var ball;
var snakes = [];

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

		// init keyboard cursors
		cursors = game.input.keyboard.createCursorKeys();

		// add the snake head
		var snake = new SnakeModel(game, {x: 100, y: 300}, cursors);
		snake.setCollision(snakeCollisionGroup, ballCollisionGroup);
		snakes.push(snake);
	}

	function update() {
		for (var i = 0; i < snakes.length; i++) {
			snakes[i].update();
		}

	}

	function render() {
		for (var i = 0; i < snakes.length; i++) {
			game.debug.spriteInfo(snakes[i]._head, 32, 32);
		}
	}
};
var SnakeModel = function(){
	this._construct.apply(this, arguments);
};

SnakeModel.prototype = {
	_head: null,
	_segments: [],
	_path: [],
	_segmentCount: 4,
	_segmentSpacing: 14,
	_gameContext: null,
	_position: {x: 400, y: 300},
	_direction: 'down',
	_started: false,
	_cursors: null,
	_bodyLoop: null,
	_construct: function(game, position, cursors) {

		this._gameContext = game;

		this._position = position;

		this._cursors = cursors;

		this.initHead();
		this.initBody();
	},
	initHead: function() {

		this._head = this._gameContext.add.sprite(this._position.x, this._position.y, 'ball');
		this._head.anchor.setTo(0.5, 0.5);
		this._gameContext.physics.p2.enable(this._head);

		this._head.body.fixedRotation = true;
	},
	initBody: function() {

		//  add the snake body
		for (var i = 1; i < this._segmentCount; i++)
		{
			this._segments[i] = this._gameContext.add.sprite(this._position.x, this._position.y, 'ball');
			this._segments[i].anchor.setTo(0.5, 0.5);
		}

		//  init the snake path array
		for (var i = 0; i <= this._segmentCount * this._segmentSpacing; i++)
		{
			this._path[i] = new Phaser.Point(this._position.x, this._position.y);
		}

		this.initBodyMovement();
	},
	setCollision: function(snakeCollisionGroup, collideWith) {
		var self = this;
		this._head.body.setCollisionGroup(snakeCollisionGroup);
		this._head.body.collides(collideWith, function(){
			Ball.onHit(self);
		}, Ball);
	},
	initBodyMovement: function() {
		var self = this;
		this._bodyLoop = game.time.create(false);
		this._bodyLoop.loop(Phaser.Timer.SECOND / 25, function(){
			self.moveBody();
		}, this);
		this._bodyLoop.start();
	},
	moveBody: function() {
		var part = this._path.pop();
		part.setTo(this._head.x, this._head.y);

		this._path.unshift(part);

		for (var i = 1; i < this._segmentCount; i++)
		{
			this._segments[i].x = (this._path[i * this._segmentSpacing]).x;
			this._segments[i].y = (this._path[i * this._segmentSpacing]).y;
		}
	},
	update: function() {
		if (!this._started) {
			this._head.body.moveDown(50);
			this._started = true;
		}

		if (this._cursors.up.isDown) {
			this._head.body.setZeroVelocity();
			this._head.body.moveUp(50);
		} else if (this._cursors.down.isDown) {
			this._head.body.setZeroVelocity();
			this._head.body.moveDown(50);
		} else if (this._cursors.left.isDown) {
			this._head.body.setZeroVelocity();
			this._head.body.moveLeft(50);
		} else if (this._cursors.right.isDown) {
			this._head.body.setZeroVelocity();
			this._head.body.moveRight(50);
		}
	}
}

var Ball = {
	onHit: function(snake) {
		console.log('ball was hit by', snake);
	}
}

