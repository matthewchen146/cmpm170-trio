// obstacle super class for anything that could be collided with
class Obstacle {
    constructor(options = {}) {
        this.pos = options.pos || vec(0,0);
        this.size = options.size || vec(10,10);
        this.color = options.color || 'black';

        if (options.addToObstacles === undefined || options.addToObstacles === true) {
            obstacles.push(this);
        }

        if (options.canCollide === undefined || options.canCollide === true) {
            this.body = Matter.Bodies.rectangle(this.pos.x, this.pos.y, this.size.x, this.size.y, {
                isStatic: true
            });
            this.body.restitution = 1;
            this.body.collisionFilter.category = 1;
            this.body.collisionFilter.mask = 1;
            Matter.Composite.add(engine.world, [this.body]);

            this.body.obstacle = this;
        }
        
        this.isDestroyed = false;
    }

    draw() {
        color(this.color);
        box(this.pos, this.size);
        color('black');
    }

    onCollide(body) {
        if (body === ball) {
            play('click');
        }
    }

    destroy() {
        if (this.body) {
            Matter.World.remove(engine.world, this.body);
        }
        this.isDestroyed = true;
    }
}

class Ground extends Obstacle {
    constructor(options = {}) {
        options.color = 'green';
        options.addToObstacles = false;
        options.canCollide = false;
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
    constructor(options = {}) {
        options.canCollide = false;
        super(options);
    }

    draw() {
        char('b', this.pos);
    }
}


async function generateLevel(seed = 0) {
    randomSeed(seed);
    const sectorCoord = vec(Math.floor(random() * 3), 4);
    let firstGround;
    let lastGround;

    clearLevel();

    // sector based
    let lastDirection = vec(0,0);
    let visitedSectors = {}
    let maxSectorCount = 10;
    for (let i = 0; i < maxSectorCount; i++) {
        // await new Promise((resolve) => {
        //     setTimeout(resolve, 100)
        // })

        let noWhereToGo = false;

        const ground = new Ground({
            pos: vec(sectorCoord).mul(48).add(27, 0),
            size: vec(48, 48)
        })
        if (!firstGround) {
            firstGround = ground;
        }
        if (visitedSectors[sectorCoord.x] === undefined) {
            visitedSectors[sectorCoord.x] = {};
        }
        visitedSectors[sectorCoord.x][sectorCoord.y] = ground;
        lastGround = ground;

        const possibleDirections = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                let newCoord = vec(sectorCoord).add(x, y);
                if (visitedSectors[newCoord.x] === undefined) {
                    visitedSectors[newCoord.x] = {};
                }
                if (Math.abs(x) + Math.abs(y) !== 2 && !(x === 0 && x === y) && !visitedSectors[newCoord.x][newCoord.y] && newCoord.x <= 2 && newCoord.x >= 0 && newCoord.y <= 4 && newCoord.y >= 1) {
                    possibleDirections.push(vec(x, y));
                }
            }
        }

        let direction = vec(0,0);
        if (possibleDirections.length === 0 || i === maxSectorCount - 1) {
            lastGround = ground;
            noWhereToGo = true;
            console.log('no where to go')
        } else {
            direction = possibleDirections[Math.floor(random() * possibleDirections.length)];
        }

        
        
        if (!(direction.x > 0 || lastDirection.x < 0)) {
            new Wall({
                pos: vec(ground.pos.x + ground.size.x * .5, ground.pos.y),
                size: vec(6, ground.size.y + 6)
            })
        }
        if (!(direction.x < 0 || lastDirection.x > 0)) {
            new Wall({
                pos: vec(ground.pos.x - ground.size.x * .5, ground.pos.y),
                size: vec(6, ground.size.y + 6)
            })
        }
        if (!(direction.y > 0 || lastDirection.y < 0)) {
            new Wall({
                pos: vec(ground.pos.x, ground.pos.y + ground.size.y * .5),
                size: vec(ground.size.x + 6, 6)
            })
        }
        if (!(direction.y < 0 || lastDirection.y > 0)) {
            new Wall({
                pos: vec(ground.pos.x, ground.pos.y - ground.size.y * .5),
                size: vec(ground.size.x + 6, 6)
            })
        }

        sectorCoord.add(direction);
        lastDirection = direction;

        if (noWhereToGo) {
            break;
        }
    }
    
    
    const hole = new Hole({
        pos: vec(lastGround.pos)
    })

    return {
        startPos: vec(firstGround.pos),
        endPos: vec(hole.pos)
    }
}

function clearLevel() {
    for (const ground of grounds) {
        ground.destroy();
    }
    for (const obstacle of obstacles) {
        obstacle.destroy();
    }
    grounds = [];
    obstacles = [];
}