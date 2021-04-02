var PLAY = 1;
var END = 0;
var gameState = PLAY;

var surfer, surfer_running, surfer_collided;
var ground, invisibleGround, groundImage;
 
var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1, obstacle3;
var score = 0;
var life = 3;

var  restart;

localStorage["HighestScore"] = 0;

function preload() {
  surfer_running = loadAnimation("surfer 2.png","surfer.png");
  surfer_collided = loadAnimation("surfer_collided.png");
  groundImage = loadImage("ground2.png");
  coinSound = loadSound("coin.wav");

  coinImage = loadImage("coin.png");
  obstacle2 = loadImage("metro2.png");
  obstacle1 = loadImage("metro1.png");
  obstacle3 = loadImage("metro3.png");
  restartImg = loadImage("restartImage.png");
}

function setup() {
  createCanvas(600, 210);
  surfer = createSprite(50, 180, 20, 50);
  surfer.addAnimation("running", surfer_running);
  surfer.scale = 0.1;

  ground = createSprite(0, 190, 1200, 10);
  ground.x = ground.width / 3;
  ground.velocityX = -(6 + 3 * score / 100)
ground.addImage(groundImage);

  restart = createSprite(307, 136);
  restart.addImage(restartImg);

  invisibleGround=createSprite(209,205,1200,20)
invisibleGround.visible=false;
  
  
  
  restart.scale = 0.012;

  restart.visible = false;
 
  coinGroup = new Group();
  obstaclesGroup = new Group();
  score = 0;
}

function draw() {
  background("lightblue");
  textSize(20);
  fill("red");
  text("Score: " + score, 500, 40);
  text("Life: " + life, 500, 60);
  
  
  
  
  if (gameState === PLAY) {
    // score = score + Math.round(getFrameRate()/60);
    if (score >= 0) {
      ground.velocityX = -6;
    } else {
      ground.velocityX = -(6 + 3 * score / 100);
    }

    if (keyDown("space") ) {
      surfer.velocityY = -13;
    }

    surfer.velocityY = surfer.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    surfer.collide(invisibleGround);

    spawnCoin();
    spawnObstacles();

    if (obstaclesGroup.isTouching(surfer)) {
      life = life - 1;
      gameState = END;
      
    }
    if (coinGroup.isTouching(surfer)) {
      score = score + 1;
      coinSound.play();
      
     coinGroup[0].destroy();
      
    }
  } else if (gameState === END) {
    restart.visible = true;
     text("restart", 280,170 );
    surfer.addAnimation("collided", surfer_collided);


    //set velcity of each game object to 0
    ground.velocityX = 0;
    surfer.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);

    //change the trex animation
    surfer.changeAnimation("collided", surfer_collided);
    surfer.scale = 0.1;

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      if (life > 0) {
        reset();
      }

    }
  }
  drawSprites();
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(600, 120, 40, 10);
    coin.y = Math.round(random(80, 120));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;

    //assign lifetime to the variable
    coin.lifetime = 200;

    //adjust the depth
    coin.depth = surfer.depth;
    surfer.depth = surfer.depth + 1;

    //add each cloud to the group
    coinGroup.add(coin);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    //generate random obstacles
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle2);
        break;
      case 2:
        obstacle.addImage(obstacle1);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
    }
    

    obstacle.velocityX = -(6 + 3 * score / 100);

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.133
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {

  gameState = PLAY;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();

 surfer.changeAnimation("running", surfer_running);
  surfer.scale = 0.1;

  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score;
  }

  score = 0;
 
}
