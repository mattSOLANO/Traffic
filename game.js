

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

function create(){

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.stage.backgroundColor = '#E8ECC7'

  game.stage.smoothed = false;

  smartGroup = game.add.group();
  smartGroup2 = game.add.group();

  game.time.events.loop(game.rnd.integerInRange(2000, 3000), newCar, this);

  game.time.events.loop(game.rnd.integerInRange(2000, 3000), newCar2, this);
  

  stopLine = game.add.sprite(500, 200, 'stopLine');

  light =  game.add.button(550, 200, 'light', changeLight, this, 0, 0, 0);

  text = game.add.text(700, 25, theScore, style);

}

var lightState = "stop";



function update(){

  


  smartGroup.forEachAlive(function(Car){

    var distanceFromStopLine = stopLine.x - Car.x;

    if (distanceFromStopLine > 40 || distanceFromStopLine < 0){

      smartGroup.forEachAlive(function(Enemy){

        var distanceFromEnemy = game.physics.arcade.distanceBetween(Car, Enemy);

        // if (Enemy.x > Car.x && distanceFromEnemy < 70 && distanceFromEnemy > 0 ){
        //   var followVel = (((Enemy.x - Car.x)/70) * 100)- 60;
        //   Car.body.velocity.set(followVel, 0);
        // }

        if (Enemy.x > Car.x && distanceFromEnemy <= 70 && distanceFromEnemy > 0 ){
          var followVel = (((distanceFromEnemy-40)/100) * Car.speed);
          Car.body.velocity.set(followVel, 0);
        }
        else if (Enemy.x > Car.x && distanceFromEnemy > 70) {
          Car.body.velocity.set(Car.speed, 0);
        }

      });

    } else if ( distanceFromStopLine <= 70 && distanceFromStopLine > 0){


      if (lightState == "stop"){
        // var approachVel = (((stopLine.x - Car.x)/100) * Car.speed) - 38;
        // Car.body.velocity.set(approachVel, 0);
        var approachVel = (((distanceFromStopLine-40)/100) * Car.speed);
        Car.body.velocity.set(approachVel, 0);
      }
      else if (lightState == "go") {
        Car.body.velocity.set(Car.speed, 0);
      }

    }

  });



  smartGroup2.forEachAlive(function(Car){

    var distanceFromStopLine = stopLine.y - Car.y;


    if (distanceFromStopLine > 40 || distanceFromStopLine < 0){

      smartGroup2.forEachAlive(function(Enemy){

        var distanceFromEnemy = game.physics.arcade.distanceBetween(Car, Enemy);

        if (Enemy.y > Car.y && distanceFromEnemy <= 70 && distanceFromEnemy > 0 ){

          var followVel = (((distanceFromEnemy-40)/70) * Car.speed);

          Car.body.velocity.set(0, followVel);
        }
        else if (Enemy.y > Car.y && distanceFromEnemy > 70) {
          Car.body.velocity.set(0, Car.speed);
        }

      });

    } else if ( distanceFromStopLine <= 70 && distanceFromStopLine > 0){


      if (lightState == "go"){
        // var approachVel = (((stopLine.x - Car.x)/100) * Car.speed) - 38;
        // Car.body.velocity.set(approachVel, 0);
        var approachVel = (((distanceFromStopLine-40)/100) * Car.speed);
        Car.body.velocity.set(0, approachVel);
      }
      else if (lightState == "stop") {
        Car.body.velocity.set(0, Car.speed);
      }

    }

  });


}



function changeLight () {
    
    if (lightState == "stop"){
      lightState = "go";
      light.setFrames(1, 1, 1);
    }
    else if (lightState == "go") {
      lightState = "stop";
      light.setFrames(0, 0, 0);
    }

}


function goodbye(obj) {
  theScore++;
  text.setText(theScore);
}


function newCar(){
    var smartCar = smartGroup.create(0, 200, 'car');
    var carSpeed = game.rnd.integerInRange(100, 200);
    game.physics.arcade.enable(smartCar);
    smartCar.anchor.setTo(0.5, 0.5);
    smartCar.checkWorldBounds = true;
    smartCar.outOfBoundsKill = true;
    smartCar.speed = carSpeed;
    smartCar.body.velocity.set(carSpeed, 0);
    smartCar.events.onOutOfBounds.add( goodbye, this );

}


function newCar2(){
    var smartCar = smartGroup2.create(550, 0, 'carVert');
    var carSpeed = game.rnd.integerInRange(100, 200);
    game.physics.arcade.enable(smartCar);
    smartCar.anchor.setTo(0.5, 0.5);
    smartCar.checkWorldBounds = true;
    smartCar.outOfBoundsKill = true;
    smartCar.speed = carSpeed;
    smartCar.body.velocity.set(0, carSpeed);
    smartCar.events.onOutOfBounds.add( goodbye, this );

}


