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

class Ground extends Obstacle {
    constructor(options = {}) {
        options.color = 'green';
        options.addToObstacles = false;
        super(options);
        grounds.push(this);
    }
}

// walls that collide with ball
class Wall extends Obstacle {
    constructor(options = {}) {
        options.color = options.color || 'black';
        super(options);
    }
}

class Hole extends Obstacle{
    constructor(options = {}){
        super(options);
    }
    draw(){
        char('a',this.pos);
    }
}


function generateLevel(seed = 0) {
    randomSeed(seed);
    const sectorCoord = vec(Math.floor(random() * 3), 4);

    clearLevel();
    // border walls
    // new Wall({
    //     pos: vec(3, G.HEIGHT * .5),
    //     size: vec(6, G.HEIGHT)
    // })
    // new Wall({
    //     pos: vec(G.WIDTH - 3, G.HEIGHT * .5),
    //     size: vec(6, G.HEIGHT)
    // })
    // new Wall({
    //     pos: vec(G.WIDTH * .5, 3),
    //     size: vec(G.WIDTH, 6)
    // })
    // new Wall({
    //     pos: vec(G.WIDTH * .5, G.HEIGHT - 3),
    //     size: vec(G.WIDTH, 6)
    // })

    // test middle wall
    // new Wall({
    //     pos: vec(G.WIDTH * .5, G.HEIGHT * .5),
    //     size: vec(50,10)
    // })

    // obstacle walls
    // for (let i = 0; i < 5; i++) {
    //     new Wall({
    //         pos: vec(random() * G.WIDTH, random() * G.HEIGHT),
    //         size: vec(50 * random() + 12,12)
    //     })
    // }

    // sector based
    let lastDirection = vec(0,0);
    for (let i = 0; i < 7; i++) {
        const ground = new Ground({
            pos: vec(sectorCoord).mul(48).add(27, 0),
            size: vec(48, 48)
        })

        let direction;
        if (random() < .8) {
            if (sectorCoord.x > 0) {
                if (sectorCoord.x === 2) {
                    direction = vec(-1, 0);
                } else {
                    direction = vec(random() > .5 ? 1 : -1, 0);
                }
            } else {
                direction = vec(1, 0);
            }
            
        } else {
            direction = vec(0, -1);
        }

        if (!(direction.x > 0 || lastDirection.x < 0)) {
            new Wall({
                pos: vec(ground.pos.x + ground.size.x * .5 - 3, ground.pos.y),
                size: vec(6, ground.size.y - 12)
            })
        }
        if (!(direction.x < 0 || lastDirection.x > 0)) {
            new Wall({
                pos: vec(ground.pos.x - ground.size.x * .5 + 3, ground.pos.y),
                size: vec(6, ground.size.y - 12)
            })
        }
        if (!(direction.y > 0 || lastDirection.y < 0)) {
            new Wall({
                pos: vec(ground.pos.x, ground.pos.y + ground.size.y * .5 - 3),
                size: vec(ground.size.x - 12, 6)
            })
        }
        if (!(direction.y < 0 || lastDirection.y > 0)) {
            new Wall({
                pos: vec(ground.pos.x, ground.pos.y - ground.size.y * .5 + 3),
                size: vec(ground.size.x - 12, 6)
            })
        }
        // corners
        new Wall({
            pos: vec(ground.pos.x + ground.size.x * .5 - 3, ground.pos.y - ground.size.y * .5 + 3),
            size: vec(6,6)
        })
        new Wall({
            pos: vec(ground.pos.x - ground.size.x * .5 + 3, ground.pos.y - ground.size.y * .5 + 3),
            size: vec(6,6)
        })
        new Wall({
            pos: vec(ground.pos.x + ground.size.x * .5 - 3, ground.pos.y + ground.size.y * .5 - 3),
            size: vec(6,6)
        })
        new Wall({
            pos: vec(ground.pos.x - ground.size.x * .5 + 3, ground.pos.y + ground.size.y * .5 - 3),
            size: vec(6,6)
        })
        

        sectorCoord.add(direction);
        lastDirection = direction;
    }
    

    new Hole({
        pos: vec(random()*G.WIDTH,random()*50)
    })
}

function clearLevel() {
    grounds = [];
    obstacles = [];
}