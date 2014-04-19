

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

  car = game.add.sprite(100, 200, 'car');
  game.physics.arcade.enable(car);

  car2 = game.add.sprite(0, 200, 'car');
  game.physics.arcade.enable(car2);

  car.body.velocity.set(100, 0);

  car2.body.velocity.set(100, 0);


  smartGroup = game.add.group();

  var numberofCars = 4;

  //var smartCar01 = smartGroup.create(game.world.randomX, 400, 'green');

  for(var i = 0; i < numberofCars; i++){
    var smartCar = smartGroup.create(100 *(i + 1), 400, 'car');
    game.physics.arcade.enable(smartCar);
    smartCar.body.velocity.set(75, 0);
    
  } 



  

  stopLine = game.add.sprite(500, 200, 'stopLine');

  light =  game.add.button(550, 200, 'light', changeLight, this, 0, 0, 0);
   // button.name = '0';

}

var lightState = "stop";

function update(){

  var distanceFromLight = stopLine.x - car.x;


  if ( distanceFromLight < 150 && distanceFromLight > 38) {
    if (lightState == "stop"){
      var approachVel = (((stopLine.x - car.x)/100) * 100) - 38;
      car.body.velocity.set(approachVel, 0);
    }
    else if (lightState == "go") {
      car.body.velocity.set(100, 0);
    }
  }


  var distanceFromCar = car.x - car2.x;
  

  if ( distanceFromCar < 100 && distanceFromCar > 38) {
    var followVel = (((car.x - car2.x)/100) * 100) - 38;
    car2.body.velocity.set(followVel, 0);
  }

  else if ( distanceFromCar >= 100){
    car2.body.velocity.set(100, 0);
  }



  smartGroup.forEach(function(Car){

    Car.events.onOutOfBounds.add( goodbye, this );

    var distanceFromStopLine = stopLine.x - Car.x;
    //console.log(distanceFromStopLine);

    if (distanceFromStopLine > 40 ){

      smartGroup.forEach(function(Enemy){

        var distanceFromEnemy = game.physics.arcade.distanceBetween(Car, Enemy);
        //console.log(distanceFromEnemy);


        // if (Enemy.x > Car.x && distanceFromEnemy < 60 && distanceFromEnemy > 0 ){
        //   var followVel = (((Enemy.x - Car.x)/30) * 40)- 40;
        //   Car.body.velocity.set(followVel, 0);
        // }

        if (Enemy.x > Car.x && distanceFromEnemy < 100 && distanceFromEnemy > 0 ){
          var followVel = (((Enemy.x - Car.x)/100) * 100)- 50;
          Car.body.velocity.set(followVel, 0);
        }

      });

    } else if ( distanceFromStopLine <= 40 && distanceFromStopLine > 10){

      if (lightState == "stop"){
        var approachVel = (((stopLine.x - Car.x)/100) * 100) - 38;
        Car.body.velocity.set(approachVel, 0);
      }
      else if (lightState == "go") {
        Car.body.velocity.set(100, 0);
      }

    }
    //var
    //console.log(distanceFromLight);
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
  console.log('adios');
  //obj.destroy();
}


