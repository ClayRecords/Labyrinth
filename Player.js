var playerSpeed = 1.5;
var MoveLeftKeyCode = 65; // A
var MoveRightKeyCode = 68; // D
var MoveUpKeyCode = 87; // W
var MoveDownKeyCode = 83; // S
var InteractKeyCode = 32; // Space

class Player {
    constructor(startingTile, color) {
        this.tileOn = startingTile;
        var offset = this.tileOn.size / 2;
        this.position = new p5.Vector(startingTile.position.x + offset, startingTile.position.y + offset);
        this.size = this.tileOn.size / 5;
        this.radius = this.size / 2;
        this.color = color;
        this.ableToMove = true;
    }

    show() {
        stroke(0);
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }

    update() {
        if (this.ableToMove) {
            this.move();
        }
    }

    move() {
        var neighborTiles = this.getNeighborTiles();
        for (var n = 0; n < neighborTiles.length; n++) {
            var neighborTile = neighborTiles[n];
            for (var xy = 0; xy < Object.keys(neighborTile.sections).length; xy++) {
                var neighborSection = neighborTile.sections[Object.keys(neighborTile.sections)[xy]];
                neighborSection.color = "yellow";
            }
        }

        var speed = new p5.Vector(0, 0);
        if (keyIsDown(MoveLeftKeyCode)) {
            speed.x -= playerSpeed;
        }
        if (keyIsDown(MoveRightKeyCode)) {
            speed.x += playerSpeed;
        }
        if (keyIsDown(MoveUpKeyCode)) {
            speed.y -= playerSpeed;
        }
        if (keyIsDown(MoveDownKeyCode)) {
            speed.y += playerSpeed;
        }

        speed.limit(playerSpeed);

        if (speed.x != 0 || speed.y != 0) {
            speed = this.checkBorderCollision(speed);
        }

        if (speed.x != 0 || speed.y != 0) {
            speed = this.checkTileCollision(speed);
        }

        if (speed.x != 0 || speed.y != 0) {
            this.position.x += speed.x;
            this.position.y += speed.y;
        }

        this.getTileOn();
    }

    checkBorderCollision(speed) {
        // If I keep moving in my current X direction, will I collide with the border?
        if (this.position.x + speed.x + this.radius > width - gridOffset) {
            speed.x = (width - gridOffset) - this.radius - this.position.x;
        } else if (this.position.x + speed.x - this.radius < gridOffset) {
            speed.x = gridOffset + this.radius - this.position.x;
        }
        // If I keep moving in my current Y direction, will I collide with the border?
        if (this.position.y + speed.y + this.radius > height - gridOffset) {
            speed.y = (height - gridOffset) - this.radius - this.position.y;
        } else if (this.position.y + speed.y - this.radius < gridOffset) {
            speed.y = gridOffset + this.radius - this.position.y;
        }
        return speed;
    }

    checkTileCollision_WORKING(speed) {
        var collisions = this.getCollisionsAfterMovement(new p5.Vector(this.position.x, this.position.y), speed);

        if (collisions.length) {
            if (abs(speed.y) > 0 && abs(speed.x) > 0) {
                var xAttemptSpeed = this.checkTileCollision(new p5.Vector(speed.x, 0));
                if (xAttemptSpeed.mag() > 0) {
                    return xAttemptSpeed;
                }
                var yAttemptSpeed = this.checkTileCollision(new p5.Vector(0, speed.y));
                if (yAttemptSpeed.mag() > 0) {
                    return yAttemptSpeed;
                }
            }

            return new p5.Vector(0, 0);
        }
        return speed;
    }

    checkTileCollision(speed) {
        var collisions = this.getCollisionsAfterMovement(new p5.Vector(this.position.x, this.position.y), speed);

        if (collisions.length) {
            console.log("")
            var smallestConstraint = null;
            var smallestConstraintTravelMagnitude = null;

            for (var i = 0; i < collisions.length; i++) {
                var collision = collisions[i];
                var object = collision.object;

                var d = getDistanceFromPointToRectangle(this.position.x, this.position.y, object.position.x, object.position.y, object.size, object.size);
                var constraint = new PlayerTileRelationship(object, d);


            }
            speed = new p5.Vector(0, 0)
        }
        return speed;
    }

    getCollisionsAfterMovement(position, speed) {
        var collisions = [];
        var neighborTiles = this.getNeighborTiles();
        for (var n = 0; n < neighborTiles.length; n++) {
            var neighborTile = neighborTiles[n];
            for (var xy = 0; xy < Object.keys(neighborTile.sections).length; xy++) {
                var neighborSection = neighborTile.sections[Object.keys(neighborTile.sections)[xy]];
                neighborSection.color = "yellow";
                if (!neighborSection.enterable) {
                    // If I keep moving in my current direction, how far will I be from this section?
                    var d = getDistanceFromPointToRectangle(position.x + speed.x, position.y + speed.y,
                        neighborSection.position.x, neighborSection.position.y, neighborSection.size, neighborSection.size);
                    var relationship = new PlayerTileRelationship(neighborSection, d);
                    if (relationship.isACollision(this.radius)) {
                        relationship.object.color = "red";
                        collisions.push(relationship);
                    } else if (relationship.magnitude - this.radius < 1.5) { // If it is nearby
                        relationship.object.color = "orange";
                    }
                }
            }
        }
        return collisions;
    }

    getTileOn() {
        var gx = floor((this.position.x - gridOffset) / tileSize);
        var gy = floor((this.position.y - gridOffset) / tileSize);
        this.tileOn = grid[gx][gy];
    }

    getNeighborTiles() {
        var neighborTiles = [];
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                var neighborgx = this.tileOn.gridPosition.x + x;
                var neighborgy = this.tileOn.gridPosition.y + y;
                if (neighborgx >= 0 && neighborgx < cols && neighborgy >= 0 && neighborgy < rows) {
                    var neighborTile = grid[neighborgx][neighborgy];
                    neighborTiles.push(neighborTile);
                }
            }
        }
        return neighborTiles;
    }
}