

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });


function preload(){
  game.load.image('car', 'car.png');
  game.load.image('stopLine', 'stopLine.png');
  game.load.image('green', 'green.png');
  game.load.spritesheet('light', 'lightSprite.png', 20,20, 2);
}




var car;
var car2;
var smartGroup;
//var smartCar;
var stopLine;
var light;

function create(){

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.stage.backgroundColor = '#E8ECC7'

  game.stage.smoothed = false;

  smartGroup = game.add.group();

  game.time.events.loop(game.rnd.integerInRange(1000, 3000), newCar, this);
  

  stopLine = game.add.sprite(500, 200, 'stopLine');

  light =  game.add.button(550, 200, 'light', changeLight, this, 0, 0, 0);

}

var lightState = "stop";

function update(){


  smartGroup.forEach(function(Car){

    Car.events.onOutOfBounds.add( goodbye, this );

    var distanceFromStopLine = stopLine.x - Car.x;

    if (distanceFromStopLine > 40 || distanceFromStopLine < 0){

      smartGroup.forEach(function(Enemy){

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
  //smartGroup.remove(obj);
  //obj.kill();
  //obj.destroy();
  
}


function newCar(){
    var smartCar = smartGroup.create(0, 200, 'car');
    var carSpeed = game.rnd.integerInRange(100, 200);
    game.physics.arcade.enable(smartCar);
    smartCar.checkWorldBounds = true;
    smartCar.outOfBoundsKill = true;
    smartCar.speed = carSpeed;
    smartCar.body.velocity.set(carSpeed, 0);
    smartCar.events.onOutOfBounds.add( goodbye, this );
}

