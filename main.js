title = "Pool Game";

description = `
[Hold] Charge Ball
[Release] Shoot Ball`;

characters = [
// a - ball
`
  ll  
 llll 
llllll
llllll
 llll 
  ll  
`,
// b - hole
`
pppppp
p    p
p    p
p    p
p    p
pppppp
`
];

const G = {
    WIDTH: 150,
    HEIGHT: 250,
};

options = {
    viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isReplayEnabled: true,
    isDrawingScoreFront: true,
};

const projectionDirection = vec(1,0);
let projectionAngle = 0;
let projection;
let projlen = 7;

let ball;
let ballStopTimer = 0;
let charge = 0;
let shot = false;

let gameReady = false;

//
// MATTER JS
//

// matterjs engine. contains engine.world, which contains all bodies such as walls, the ball, etc.
const engine = Matter.Engine.create();
engine.gravity.y = 0;

//
Matter.Events.on(engine, 'collisionActive', (e) => {
    
})
Matter.Events.on(engine, 'collisionStart', (e) => {
    
})
Matter.Events.on(engine, 'collisionEnd', (e) => {
    
})


// array of ground objects. these are the green things
let grounds = [];

// array of obstacles. this includes walls, hazards, the such
let obstacles = [];

function update() {
    if (!ticks) {

        projection = { angle: 0, length: projlen, pin: ball };

        // shot represents whether the ball is currently traveling or not
        shot = false;

        // generates level. this is here for testing at the moment
        // later, a new level will be created after every level completion
        // generate level returns level data, that contains start position, end position, etc.
        const { startPos } = generateLevel();

        // creates matterjs body that represents the ball
        ball = Matter.Bodies.circle(startPos.x, startPos.y, 4);

        // sets the ball's bounciness. between 0 and 1
        ball.restitution = 1;

        // adds ball to the engine.world
        Matter.Composite.add(engine.world, [ball]);

        // this variable is to prevent you from holding input after pressing start
        // it is set to true after the first input release
        gameReady = false;
    }

    // updates the matterjs engine every frame
    Matter.Engine.update(engine);


    //
    // DRAWING THE LEVEL
    //

    // draws green grounds
    for (let i = 0; i < grounds.length; i++) {
        const ground = grounds[i];
        ground.draw();
    }

    // draws all the obstacles into the world
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        obstacle.draw();
    }

    

    //
    // PLAYER INPUT
    //


    // increases charge as input is pressed. charge affects how hard the ball is launched
    if (input.isPressed && !shot && gameReady) {
        // max charge is 1
        charge = Math.min(charge + .01, 1);
    } else {
        if (!shot) {
            // calculates rotation around a point
            projectionDirection.set(
                Math.cos(projectionAngle),
                Math.sin(projectionAngle),
            )
            // speed at which the projection marker rotates
            // a good speed is .04 radians per frame
            projectionAngle += .04;
        }
    }


    // on input release, the ball is launched
    if (input.isJustReleased) {
        if (gameReady) {

            if (!shot) {
                // this applies a force to the ball based on the charge
                // the value .001 is ideal as the max after testing
                const force = vec(projectionDirection).mul(.001 * charge)
                Matter.Body.applyForce(ball, ball.position, {x: force.x, y: force.y});
                shot = true;
    
                // reset projection angle
                projectionAngle = 0;
                projectionDirection.set(1, 0);
            }

        } else {

            // sets the game to ready after first release to prevent initial accidental shot
            gameReady = true;

        }
    }
    
    // checks if the ball speed is below a threshold, and checks if it is for a second
    if (shot) {
        // stops the ball when the ball speed is slow enough, and enables the ball to be launched again
        if (ballStopTimer > 60) {
            shot = false;

            // reset ball speed and charge
            Matter.Body.setVelocity(ball, {x: 0, y: 0});
            charge = 0;

            // reset ballstoptimer
            ballStopTimer = 0;
        } else {
            if (ball.speed < .01) {
                ballStopTimer += 1;
            } else {
                ballStopTimer = 0;
            }
        }   
    }
    

    // draw projection line while not shot
    const ballPos = vec(ball.position.x, ball.position.y);
    if (!shot) {
        color("blue");
        line(ballPos, vec(ballPos).add(vec(projectionDirection).mul(12)));
    }

    color('white');
    let collision = char('a', ballPos);
    color('black');

    // Check if ball Collided with the Goal
    if(collision.isColliding.char.a){
        text("GOAL!!!",50,50);
    }
}