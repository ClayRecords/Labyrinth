var playerSpeed = 3;
var MoveLeftKeyCode = 65; // A
var MoveRightKeyCode = 68; // D
var MoveUpKeyCode = 87; // W
var MoveDownKeyCode = 83; // S
var InteractKeyCode = 32; // Space

class Player {
    constructor(startingTile, color) {
        this.tileOn = startingTile;
        var offset = this.tileOn.size / 2;
        this.lx = startingTile.lx + offset;
        this.ly = startingTile.ly + offset;
        this.size = this.tileOn.size / 5;
        this.radius = this.size / 2;
        this.color = color;
        this.ableToMove = true;
    }

    show() {
        stroke(0);
        fill(this.color);
        ellipse(this.lx, this.ly, this.size, this.size);
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

        if (this.ableToMove) {
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

            if (speed.x != 0 || speed.y != 0) {
                speed = this.checkBorderCollision(speed);
            }

            if (speed.x != 0 || speed.y != 0) {
                speed = this.checkTileCollision(speed);
            }

            if (speed.x != 0 || speed.y != 0) {
                this.lx += speed.x;
                this.ly += speed.y;
            }

            this.getTileOn();
        }
    }

    checkBorderCollision(speed) {
        // If I keep moving in my current X direction, will I collide with the border?
        if (this.lx + speed.x + this.radius > width - gridOffset) {
            speed.x = (width - gridOffset) - this.radius - this.lx;
        } else if (this.lx + speed.x - this.radius < gridOffset) {
            speed.x = gridOffset + this.radius - this.lx;
        }
        // If I keep moving in my current Y direction, will I collide with the border?
        if (this.ly + speed.y + this.radius > height - gridOffset) {
            speed.y = (height - gridOffset) - this.radius - this.ly;
        } else if (this.ly + speed.y - this.radius < gridOffset) {
            speed.y = gridOffset + this.radius - this.ly;
        }
        return speed;
    }

    checkTileCollision(speed) {
        var collisions = this.getCollisionsAfterMovement(speed);
        
        if (collisions.length > 0) {
            shapes.push({ "shape": "circle", "x": this.lx + speed.x, "y": this.ly + speed.y, "diameter": this.size })
        }

        console.log("")
        for (var i = 0; i < collisions.length; i++) {
            var collision = collisions[i];
            var object = collision.object;

            collision.object.color = "red";

            var d = getDistanceFromCircleToRectangle(this.lx, this.ly,
                object.lx, object.ly, object.size, object.size);
            var constraint = new PlayerTileRelationship(object, d);

            console.log("Distance: " + constraint.distance.toString())
            console.log("Mag: " + constraint.magnitude.toString())

            var travelDistance = constraint.getTravelDistance(speed, this.radius);
            console.log("travelDistance: " + travelDistance.toString());
            speed = travelDistance;
        }
        return speed;
    }

    getCollisionsAfterMovement(speed) {
        var collisions = [];
        var neighborTiles = this.getNeighborTiles();
        for (var n = 0; n < neighborTiles.length; n++) {
            var neighborTile = neighborTiles[n];
            for (var xy = 0; xy < Object.keys(neighborTile.sections).length; xy++) {
                var neighborSection = neighborTile.sections[Object.keys(neighborTile.sections)[xy]];
                neighborSection.color = "yellow";
                if (!neighborSection.enterable) {
                    // If I keep moving in my current direction, how far will I be from this section?
                    var d = getDistanceFromCircleToRectangle(this.lx + speed.x, this.ly + speed.y,
                        neighborSection.lx, neighborSection.ly, neighborSection.size, neighborSection.size);
                    var relationship = new PlayerTileRelationship(neighborSection, d);
                    if (relationship.isACollision(this.radius)) {
                        collisions.push(relationship);
                    } else if (relationship.magnitude - this.radius < 1.5) {
                        relationship.object.color = "orange";
                    }
                }
            }
        }
        return collisions;
    }

    getTileOn() {
        var gx = floor((this.lx - gridOffset) / tileSize);
        var gy = floor((this.ly - gridOffset) / tileSize);
        this.tileOn = grid[[gx, gy]];
    }

    getNeighborTiles() {
        var neighborTiles = [];
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                var neighborgx = this.tileOn.gx + x;
                var neighborgy = this.tileOn.gy + y;
                if (neighborgx >= 0 && neighborgx < cols && neighborgy >= 0 && neighborgy < rows) {
                    var neighborTile = grid[[neighborgx, neighborgy]];
                    neighborTiles.push(neighborTile);
                }
            }
        }
        return neighborTiles;
    }
}