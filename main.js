title = "Pool Game";

description = `
[Hold] Charge Ball
[Release] Shoot Ball`;

characters = [
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

let projection;
let projlen = 7;

let ball;
let charge = 0;
let shot = false;

// matterjs engine. contains engine.world, which contains all bodies such as walls, the ball, etc.
const engine = Matter.Engine.create();
engine.gravity.y = 0;

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
        let startPos = generateLevel();

        // creates matterjs body that represents the ball
        ball = Matter.Bodies.circle(startPos.x, startPos.y, 4);

        // sets the ball's bounciness. between 0 and 1
        ball.restitution = 1;

        // adds ball to the engine.world
        Matter.Composite.add(engine.world, [ball]);
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
    if(input.isPressed && charge < 1 && shot === false){
        charge += .01;
    }

    // on input release, the ball is launched
    if (input.isJustReleased && shot === false) {
        // this applies a force to the ball based on the charge
        // the value .001 is ideal as the max after testing
        Matter.Body.applyForce(ball, ball.position, {x: .001 * charge, y: -.001 * charge});
        shot = true;
    }
    
    // stops the ball when the ball speed is slow enough, and enables the ball to be launched again
    if (ball.speed < .01 && shot === true) {
        Matter.Body.setVelocity(ball, {x: 0, y: 0});
        charge = 0;
        shot = false;
    }
    

    //Projection Line
    color("blue");
    line(projection.pin, vec(projection.pin).addWithAngle(projection.angle, projection.length));

    color('white');
    let collision = box(ball.position.x, ball.position.y, 4, 4);
    color('black');

    // Check if ball Collided with the Goal
    if(collision.isColliding.char.a){
        text("GOAL!!!",50,50);
    }
}