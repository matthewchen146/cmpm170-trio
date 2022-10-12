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


function generateLevel(seed = 1) {
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
        } else {
            direction = possibleDirections[Math.floor(random() * possibleDirections.length)];
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
        pos: vec(lastGround.pos)
    })

    return firstGround.pos;
}

function clearLevel() {
    grounds = [];
    obstacles = [];
}