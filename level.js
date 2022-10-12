// obstacle super class for anything that could be collided with
class Obstacle {
    constructor(options = {}) {
        this.pos = options.pos || vec(0,0);
        this.size = options.size || vec(10,10);
        this.color = options.color || 'black';

        if (options.addToObstacles === undefined || options.addToObstacles === true) {
            obstacles.push(this);
        }
    }

    draw() {
        color(this.color);
        box(this.pos, this.size);
        color('black');
    }
}


// walls that collide with ball
class Wall extends Obstacle {
    constructor(options = {}) {
        options.color = options.color || 'black';
        super(options);
    }
}


function generateLevel(seed = 0) {
    
    char('a',rnd(0,G.WIDTH),rnd(30,G.HEIGHT));
    clearLevel();
    // border walls
    new Wall({
        pos: vec(3, G.HEIGHT * .5),
        size: vec(6, G.HEIGHT)
    })
    new Wall({
        pos: vec(G.WIDTH - 3, G.HEIGHT * .5),
        size: vec(6, G.HEIGHT)
    })
    new Wall({
        pos: vec(G.WIDTH * .5, 3),
        size: vec(G.WIDTH, 6)
    })
    new Wall({
        pos: vec(G.WIDTH * .5, G.HEIGHT - 3),
        size: vec(G.WIDTH, 6)
    })

    // test middle wall
    new Wall({
        pos: vec(G.WIDTH * .5, G.HEIGHT * .5),
        size: vec(50,10)
    })
}

function clearLevel() {
    obstacles = [];
}