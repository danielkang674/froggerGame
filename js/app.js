// initial starting positions
const leftStartPosition = -101;
const rightEndPosition = 606;
const midStartPos = {x:202, y:380};
const row = {first: 60, second: 140, third: 220};
const column = [0, 101, 202, 303, 404];

// player movement
const move = {left: -101, right: 101, up:-80, down: 80};

// Enemy speeds
const speed = {slow: 100, medium: 300, fast: 500};

// level object 
let level = {
  dom: document.getElementById("level"), 
  num: 1,
  up(){
    this.num++;
    level.dom.innerHTML = `Level: ${this.num}`;
  }
};

let lives = {
  dom: document.getElementById("lives"), 
  num: 3,
  up(){
    this.num++;
    this.dom.innerHTML = `Lives: ${this.num}`;
  },
  down(){
    this.num--;
    this.dom.innerHTML = `Lives: ${this.num}`;
  },
  restart(){
    this.num = 3;
    this.dom.innerHTML = `Lives: ${this.num}`;
  },
  update(){
    if(this.num === 0){
      alert('U ded');
      this.restart();
      window.location.reload(true);
    }
  }
};

let score = {
  dom: document.getElementById("score"), 
  num: 0,
  up(){
    this.num++;
    this.dom.innerHTML = `Score: ${this.num}`;
  }
};


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // Setting the initial location on the 2D map
    this.x = randomIndex(column);
    this.y = this.randomProperty(row);
    // Setting the speed of the enemy
    this.speed = this.randomProperty(speed);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  let range = 45;
  if(this.x+range >= player.x && this.x-range <= player.x && this.y === player.y){
    player.return();
    lives.down();
  }
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if(this.x < rightEndPosition){
    this.x += (this.speed * dt);
  } else {
    this.x = leftStartPosition;
  }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// choose a random property for speed and row
Enemy.prototype.randomProperty = function (obj) {
  let keys = Object.keys(obj);
  return obj[keys[ keys.length * Math.random() << 0]];
};

// choose a random property for row and column
let randomProperty = function(obj) {
  let keys = Object.keys(obj);
  return obj[keys[ keys.length * Math.random() << 0]];
};

// choose a random index for row and column
let randomIndex = function(obj){
  return obj[obj.length * Math.random() << 0];
};

// restart to first level
let restartEnemy = function(){
  allEnemies = [];
  let tempRow = ['first', 'second', 'third'];
  for(let i = 0; i < level.num + 2; i++){
    let tempEnemy = new Enemy;
    tempEnemy.y = row[tempRow[i]];
    allEnemies.push(tempEnemy);
  }
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Player is a new class
var Player = function({x, y}){
  // Setting the initial location on the 2D map
  this.x = x;
  this.y = y;

  // The image/sprite for our player
  this.sprite = 'images/char-cat-girl.png';
}

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Updates the player's position for different events
Player.prototype.update = function(){
  let botBoundary = 380;
  let rightBoundary = 404;
  let leftBoundary = 0;
  if(this.y < row.first){
    player.return();
    level.up();
    allEnemies.push(new Enemy);
    gem.location();
    heart.location();
  }
  if(this.y > botBoundary){
    player.y += move.up;
  }
  if(this.x > rightBoundary){
    player.x += move.left;
  }
  if(this.x < leftBoundary){
    player.x += move.right;
  }
}

// Player returns to starting position
Player.prototype.return = function(){
  this.x = midStartPos.x;
  this.y = midStartPos.y;
}

// Movement for the player
Player.prototype.handleInput = function(key){
  switch(key){
    case 'left':
      this.x += move.left;
      break;
    case 'right':
      this.x += move.right;
      break;
    case 'up':
      this.y += move.up;
      break;
    case 'down':
      this.y += move.down;
      break;
  }
};

// Item Super Class
var Item = function(sprite){
  this.location();
  this.sprite = sprite;
};
// draw the Item on the screen
Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Choose a random location for the item
Item.prototype.location = function(){
  this.x = randomIndex(column);
  this.y = randomProperty(row);
}

// Heart subclass of Item
var Heart = function (x,y,sprite){
  Item.call(this, x, y, sprite);
}
// Standard prototype creation for a subclass
Heart.prototype= Object.create(Item.prototype);
Heart.prototype.constructor = Heart;
// Player touches Heart update function
Heart.prototype.update = function(){
  let range = 25;
  if(this.x+range >= player.x && this.x-range <= player.x && this.y === player.y){
    lives.up();
    this.x = -200;
    this.y = -200;
  }
}

// Gem subclass of Item
var Gem = function(sprite){
  this.location();
  this.sprite = sprite;
};
// Standard prototype creation for a subclass
Gem.prototype= Object.create(Item.prototype);
Gem.prototype.constructor = Gem;
// Player touches Gem update function
Gem.prototype.update = function(){
  let range = 25;
  if(this.x+range >= player.x && this.x-range <= player.x && this.y === player.y){
    score.up();
    this.x = -200;
    this.y = -200;
  }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
restartEnemy();
let player = new Player(midStartPos);
let gem = new Gem('images/Gem Blue.png');
let heart = new Heart('images/Heart.png');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
