var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var platforms;
var player;
var cursors; 
var stars;
var scoreText;
var bomb;
var pdv=3;


function preload(){
	this.load.image('background','assets/mountains.png')
	this.load.image('etoile','assets/star2.png');
	this.load.image('sol','assets/plat3.png');
	this.load.image('bomb','assets/piaf2.png');
	this.load.spritesheet('perso','assets/Player_run.png',{frameWidth: 29, frameHeight: 41});
	
	
	
}



function create(){
	this.add.image(400,300,'background').setScale(3);
	
	
	
	

	platforms = this.physics.add.staticGroup();
	platforms.create(370,500,'sol');
	platforms.create(670,350,'sol');
	platforms.create(150,250,'sol');
	
	player = this.physics.add.sprite(300,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);
	
	
	
	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
		frameRate: 20
	});
	
	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:30,y:0,stepX:70}
	});
	
	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	pdv = this.add.text(300,16, 'Point de vie: 3', {fontSize: '32px', fill:'#000'});
	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
}



function update(){
	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(false);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	
	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-330);
	} 
	
}
//modif points de vie
function hitBomb(player, bomb){
	this.physics.setAttribute(pdv = pdv -1);
	player.setTint(0xff0000);
	gameOver=false;
	bomb.disableBody(true,true);
	pdv -= 1;
	scoreText.setText('Point de vie: '-point de vie);
	
	
}




function collectStar(player, star){
	star.disableBody(true,true);
	score += 1;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});
		
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 15, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}