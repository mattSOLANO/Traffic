var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload(){
  game.load.image('car', 'car.png');
  game.load.image('carVert', 'car_vert.png');
  game.load.image('stopLine', 'stopLine.png');
  game.load.image('green', 'green.png');
  game.load.spritesheet('light', 'lightSprite.png', 20,20, 2);
}

var smartGroup;
var smartGroup2;
var stopLine;
var light;
var style = { font: "20px Arial", fill: "#373737", align: "center" };
var theScore = 0;
var text;
var intersections = [
  {x: 300, y: 300},
  {x: 600, y: 300}
];
var directions = ['right', 'down'];
var carCollisionGroup;

function create(){

  game.physics.startSystem(Phaser.Physics.P2JS);

  game.stage.backgroundColor = '#E8ECC7'

  game.stage.smoothed = false;

  carCollisionGroup = game.physics.p2.createCollisionGroup();

  smartGroup = game.add.group();
  smartGroup.enableBody = true;
  smartGroup.physicsBodyType = Phaser.Physics.P2JS;

  game.time.events.loop(game.rnd.integerInRange(1000, 1500), createSmartCar, this);

  lightGroup = game.add.group();
  lightGroup.enableBody = true;

  intersections.forEach(function(intersection){
    var newLight = game.make.button(intersection.x, intersection.y, 'light', changeLight, this, 0, 0, 0);
    newLight.lightState = 'red';
    lightGroup.add(newLight);
  });

  text = game.add.text(700, 25, theScore, style);

}

function update(){

   smartGroup.forEachAlive( function(Car) {

      lightGroup.forEachAlive( function(Light) {
          var distanceFromLight;
          if (Car.direction === 'right' && Car.y === Light.y) {
              distanceFromLight = Light.x - Car.x;
          }
          else if (Car.direction === 'down' && Car.x === Light.x) {
              distanceFromLight = Light.y - Car.y;
          }

          if (distanceFromLight > 40 || distanceFromLight < 0) {
              smartGroup.forEachAlive( function(Enemy) {
                 if(Enemy.direction === Car.direction) {
                   var distanceFromEnemy = game.physics.arcade.distanceBetween(Car, Enemy);
                   if (Car.direction === 'right') {
                     if (Enemy.x > Car.x && distanceFromEnemy <= 70 && distanceFromEnemy > 0 ){
                       var followVel = (((distanceFromEnemy-40)/35) * Car.speed);
                       Car.body.velocity.x = followVel;
                     }
                     else if (Enemy.x > Car.x && distanceFromEnemy > 70) {
                       Car.body.velocity.x = Car.speed;
                     }
                   }
                   else if (Car.direction === 'down') {
                     if (Enemy.y > Car.y && distanceFromEnemy <= 70 && distanceFromEnemy > 0 ){
                       var followVel = (((distanceFromEnemy-40)/35) * Car.speed);
                       Car.body.velocity.y = followVel;
                     }
                     else if (Enemy.y > Car.y && distanceFromEnemy > 70) {
                       Car.body.velocity.y = Car.speed;
                     }
                   }

                 }

              });
          }
          else if (distanceFromLight <= 70 && distanceFromLight > 0) {
            if (Car.direction === 'right') {
              if (Light.lightState == "red") {
                var approachVel = (((distanceFromLight-40)/100) * Car.speed);
                Car.body.velocity.x = approachVel;
              }
              else if (Light.lightState == "green") {
                Car.body.velocity.x = Car.speed;
              }
            }
            else if (Car.direction === 'down') {
              if (Light.lightState == "green") {
                var approachVel = (((distanceFromLight-40)/100) * Car.speed);
                Car.body.velocity.y = approachVel;
              }
              else if (Light.lightState == "red") {
                Car.body.velocity.y = Car.speed;
              }
            }
          }

      });

  });

}

function changeLight (light) {
    console.log(light.lightState);
    if (light.lightState === "red"){
      light.lightState = "green";
      light.setFrames(1, 1, 1);
    }
    else if (light.lightState === "green") {
      light.lightState = "red";
      light.setFrames(0, 0, 0);
    }
}


function goodbye(obj) {
  theScore++;
  text.setText(theScore);
}

function setDirection() {
  return directions[Math.floor(Math.random() * directions.length)];
};

function setSpawnPoint(direction) {
  var spawnPoint = {};
  var randomIntersection = intersections[Math.floor(Math.random() * intersections.length)];
  switch (direction) {
    case 'down':
      spawnPoint.x = randomIntersection.x;
      spawnPoint.y = 0;
      break;
    case 'right':
      spawnPoint.x = 0;
      spawnPoint.y = randomIntersection.y;
      break;
    default:
      spawnPoint.x = randomIntersection.x;
      spawnPoint.y = 0;
  }
  return spawnPoint;
};

function setSpeed() {
  return game.rnd.integerInRange(100, 240);
};

function smartCar(spawnPoint, direction, speed) {
  var smartCar = smartGroup.create(spawnPoint.x, spawnPoint.y);
  smartCar.anchor.setTo(0.5, 0.5);
  smartCar.checkWorldBounds = true;
  smartCar.outOfBoundsKill = true;
  smartCar.speed = speed;
  smartCar.direction = direction;
  switch (direction) {
    case 'down':
      smartCar.body.velocity.y = speed;
      smartCar.loadTexture('carVert');
      break;
    case 'right':
      smartCar.body.velocity.x = speed;
      smartCar.loadTexture('car');
      break;
    default:
      break;
  }
  smartCar.body.setCollisionGroup(carCollisionGroup);
  smartCar.body.collides(carCollisionGroup, hitCar, this);
  smartCar.body.createBodyCallback(carCollisionGroup, hitCar, this);
  smartCar.events.onOutOfBounds.add( goodbye, this );
};

function createSmartCar() {
  var direction = setDirection();
  var spawnPoint = setSpawnPoint(direction);
  var speed = setSpeed();
  smartCar(spawnPoint, direction, speed);
};

function hitCar() {
  console.log('carHit');
};
