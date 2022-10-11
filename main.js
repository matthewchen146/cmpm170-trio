title = "Pool Game";

description = `
[Hold] Charge Ball
[Release] Shoot Ball`;

characters = [];

const G = {
  WIDTH: 150,
  HEIGHT: 250,
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isReplayEnabled: true,
  isDrawingScoreFront: true,

};

/** @type {{angle: number, length: number, pin: Vector}} */
let projection;
let projlen = 7;

///** @type {Vector[]} */
let ball;
let shiftspeed = 0;
let dropspeed = 0;
let bonks = 0;
let charge = 0;
let shot = false;
let switching = false;
let launch = 0;

/**
* @typedef {{
* pos: Vector, vx: number, vy: number, start: Vector
* }} Pin
*/

/**
* @type  { Pin [] }
*/
let pins = [];

function update() {
  if (!ticks) {
    shiftspeed = 0;
    dropspeed = 0;
    ball = vec(G.WIDTH/2, 4 * G.HEIGHT/5);
    projection = { angle: 0, length: projlen, pin: ball };

    pins = [];
    let heightPos = G.HEIGHT/2;
    let widthPos = G.WIDTH/2;
    for (let y = 1; y < 5; y++) {
      let widthDis = widthPos;
      for (let x = 0; x < y; x++) {
        pins.push({
          pos: vec(widthDis, heightPos),
          vx: 0,
          vy: 0,
          start: vec(widthDis, heightPos)
        });
        widthDis += G.WIDTH/15
      } 
      widthPos -= G.WIDTH/30;
      heightPos -= G.HEIGHT/50;
    }
  }

  if ( switching == false){
    projection.angle -= 0.05;
  }
  else if( switching == true){
    //console.log("helo")
    projection.angle += 0.05;
    //console.log(Math.round(projection.angle))
  }
  if (Math.round(projection.angle) < -3){
    //console.log(Math.round(projection.angle))
    switching = true;
  }
  if(Math.round(projection.angle) > 0){
    //console.log(Math.round(projection.angle))
    //console.log("yo")
    switching = false;
  }

  if(input.isPressed && charge<0.15 && shot == false){
    charge+=.003;
    shiftspeed += charge;
    dropspeed += charge;
    //shot = true;

  }
  if(input.isJustReleased && shot ==false){
    shot = true;
    projection.length = 0;
    //console.log("PROJECTION CHECK")
    //console.log(projection.angle);
    manipshift = 1.5 - Math.abs(projection.angle)  
    if(projection.angle < -1.5){
     //shiftspeed *= (projection.angle);
     shiftspeed *=  manipshift;
     manipdrop = -3 - projection.angle;
     dropspeed *=  manipdrop;
     //console.log("PROJECTION CHECK")
    }
    else if(Math.round(projection.angle == -1.5)){
      shiftspeed =0; 
    }
    else{
      shiftspeed *= 1 * manipshift;
      manipdrop = 0 + projection.angle;
      dropspeed *=  manipdrop;
    }
  }
  if (ball.x < G.WIDTH/16 || ball.x > 15*G.WIDTH/16){
    bonks -= 0.01;
    //ball.x = 10;
    shiftspeed *= -1 ; 
    //dropspeed *= -1;
  }
  if (ball.y < 1.3*G.HEIGHT/8 || ball.y > 7.7*G.HEIGHT/8 ){
    bonks-= 0.01;
    //ball.x = 10;
    dropspeed *= -1 ;
    //dropspeed *= -1;
  }
  if (shot == true) {
    if (shiftspeed != 0){
      shiftspeed = shiftspeed /1.005;
    }
    if (dropspeed != 0){
      dropspeed = dropspeed/1.005;
    }

    if((Math.abs(shiftspeed)<.01) && (Math.abs(dropspeed)<.01)){
      //console.log("zero");
      shiftspeed = 0;
      dropspeed = 0;
      charge = 0;
      shot = false;
    }
    ball.y += dropspeed;
    ball.x += shiftspeed;
    //console.log(charge);
  }

  if (shot == false){
    //ball.x = ball.x; //G.WIDTH/2 
    //ball.y = ball.y; //4 * G.HEIGHT/5
    projection.length = 7;
    //box(ball, 3);
  }

  //Board
  color("green");
  rect(0, G.HEIGHT/8, G.WIDTH, 8*G.HEIGHT/8);
  color("black");
  rect(0, G.HEIGHT/8, G.WIDTH, G.HEIGHT/20);
  rect(0, G.HEIGHT/8, G.WIDTH/14, G.HEIGHT);
  rect(G.WIDTH, G.HEIGHT, -G.WIDTH, -G.HEIGHT/20);
  rect(G.WIDTH, G.HEIGHT, -G.WIDTH/14, -7*G.HEIGHT/8);
  color("purple");
  rect(G.WIDTH/15, 1.4*G.HEIGHT/8, G.WIDTH/12, G.WIDTH/12);
  rect(12.8*G.WIDTH/15, 1.4*G.HEIGHT/8, G.WIDTH/12, G.WIDTH/12);
  rect(G.WIDTH/15, 7.25*G.HEIGHT/8, G.WIDTH/12, G.WIDTH/12);
  rect(12.8*G.WIDTH/15, 7.25*G.HEIGHT/8, G.WIDTH/12, G.WIDTH/12);
  //Projection Line
  color("light_black");
  line(projection.pin, vec(projection.pin).addWithAngle(projection.angle, projection.length));
  //Ball
  color("blue");
  box(ball, 4);
  //Pins(other balls)
  color("red");
  pins.forEach((s) => {
    //collision with the ball
    if (abs(s.pos.y - ball.y) < 4 && abs(s.pos.x - ball.x) < 4 && shot == true) {
      //console.log("collision");
      s.vx = shiftspeed;
      s.vy = dropspeed;
      shiftspeed *= -1;
      dropspeed *=-1;
    }

    //collision with other pins
    pins.forEach((p) => {
      if (abs(s.pos.y - p.pos.y) < 4 && abs(s.pos.x - p.pos.x) < 4 && s != p) {
        //console.log("collision");
        s.vx = p.vx;
        s.vy = p.vy;
        p.vx *= -1;
        p.vy *= -1;
      }
    });
    //slows down pins over time
    pins.forEach((p) => {
      if (p.vy!= 0){
        p.vy = p.vy /1.001;
      }
      if (p.vx != 0){
        p.vx = p.vx/1.001;
      }
    });


    //collision with walls
    if (s.pos.x < G.WIDTH/16 || s.pos.x > 15*G.WIDTH/16) {
      if (s.pos.x < G.WIDTH/16){
        s.pos.x += 1
      }
      else{
        s.pos.x -=1
      }
      s.vx *= -1;
    }
    if (s.pos.y < 1.3*G.HEIGHT/8 || s.pos.y > 7.7*G.HEIGHT/8 ) {
      if (s.pos.y < 1.3*G.HEIGHT/8) {
        s.pos.y += 1
      }
      else{
        s.pos.y -=1
      }
      s.vy *= -1;
    }

    s.pos.x += s.vx;
    s.pos.y += s.vy;

    box(s.pos, 4);
  });

  color("yellow");
  rect(11.7*G.WIDTH/13, 14.9*G.HEIGHT/16, 1, 1)
  if (abs(1.4*G.WIDTH/13 - ball.x) < 4.9 && abs(3.1*G.HEIGHT/16 - ball.y) < 4.9) { //top-left
    end();
  }
  else if (abs(11.7*G.WIDTH/13 - ball.x) < 4.9 && abs(3.1*G.HEIGHT/16 - ball.y) < 4.9) { //top-right
    end();
  }
  else if (abs(1.4*G.WIDTH/13 - ball.x) < 4.9 && abs(14.9*G.HEIGHT/16 - ball.y) < 4.9) { //bottom-left
    end();
  }
  else if (abs(11.7*G.WIDTH/13 - ball.x) < 4.9 && abs(14.9*G.HEIGHT/16 - ball.y) < 4.9) { //bottom-right
    end();
  }
  
}
addEventListener("load", onLoad);