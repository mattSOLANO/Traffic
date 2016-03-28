

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });


function preload(){
  game.load.image('car', 'car.png');
  game.load.image('stopLine', 'stopLine.png');
  game.load.image('green', 'green.png');
  game.load.spritesheet('light', 'lightSprite.png', 20,20, 2);
}


var smartGroup;
//var smartCar;
var stopLine;
var light;
var lightState = "stop";


function create(){

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.stage.backgroundColor = '#E8ECC7'

  game.stage.smoothed = false;

  smartGroup = game.add.group();


  stopLine = game.add.sprite(500, 200, 'stopLine');

  light =  game.add.button(550, 200, 'light', changeLight, this, 0, 0, 0);

}



function update(){


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
   

}

