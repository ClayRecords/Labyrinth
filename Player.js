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
            var speedVector = new p5.Vector(0, 0);
            if (keyIsDown(MoveLeftKeyCode)) {
                speedVector.x -= playerSpeed;
            }
            if (keyIsDown(MoveRightKeyCode)) {
                speedVector.x += playerSpeed;
            }
            if (keyIsDown(MoveUpKeyCode)) {
                speedVector.y -= playerSpeed;
            }
            if (keyIsDown(MoveDownKeyCode)) {
                speedVector.y += playerSpeed;
            }

            if (speedVector.x != 0 || speedVector.y != 0) {
                speedVector = this.checkBorderCollision(speedVector);
            }

            if (speedVector.x != 0 || speedVector.y != 0) {
                speedVector = this.checkTileCollision(speedVector);
            }

            if (speedVector.x != 0 || speedVector.y != 0) {
                this.lx += speedVector.x;
                this.ly += speedVector.y;
            }

            this.getTileOn();
        }
    }

    checkBorderCollision(speedVector) {
        // If I keep moving in my current X direction, will I collide with the border?
        if (this.lx + speedVector.x + this.radius > width - gridOffset) {
            this.lx = (width - gridOffset) - this.radius;
            speedVector.x = 0;
        } else if (this.lx + speedVector.x - this.radius < gridOffset) {
            this.lx = gridOffset + this.radius;
            speedVector.x = 0;
        }
        // If I keep moving in my current Y direction, will I collide with the border?
        if (this.ly + speedVector.y + this.radius > height - gridOffset) {
            this.ly = (height - gridOffset) - this.radius;
            speedVector.y = 0;
        } else if (this.ly + speedVector.y - this.radius < gridOffset) {
            this.ly = gridOffset + this.radius;
            speedVector.y = 0;
        }
        return speedVector;
    }

    checkTileCollision(speedVector) {
        var closestNeighbor;
        var closestNeighborDistance;
        var closestNeighborMag;

        var neighborTiles = this.getNeighborTiles();
        for (var n = 0; n < neighborTiles.length; n++) {
            var neighborTile = neighborTiles[n];
            for (var xy = 0; xy < Object.keys(neighborTile.sections).length; xy++) {
                var neighborSection = neighborTile.sections[Object.keys(neighborTile.sections)[xy]];
                neighborSection.color = "yellow";
                if (!neighborSection.enterable) {
                    // If I keep moving in my current X direction, how far will I be from this section?
                    var d = getDistanceFromCircleToRectangle(this.lx + speedVector.x, this.ly + speedVector.y,
                        neighborSection.lx, neighborSection.ly, neighborSection.size, neighborSection.size);
                    if (closestNeighbor === undefined) {
                        closestNeighbor = neighborSection;
                        closestNeighborDistance = d;
                        closestNeighborMag = d.mag();
                    } else if (Math.abs(d.mag()) < Math.abs(closestNeighborMag)) {
                        closestNeighbor = neighborSection;
                        closestNeighborDistance = d;
                        closestNeighborMag = d.mag();
                    }
                }
            }
        }

        closestNeighbor.color = "orange";

        console.log("")
        if (Math.abs(closestNeighborMag) - 1 < this.radius) {
            
            shapes.push({ "shape": "circle", "x": this.lx + speedVector.x, "y": this.ly + speedVector.y, "diameter": this.size })
            closestNeighbor.color = "red";

            var d = getDistanceFromCircleToRectangle(this.lx, this.ly,
                closestNeighbor.lx, closestNeighbor.ly, closestNeighbor.size, closestNeighbor.size);
            var collision = new PlayerCollision(closestNeighbor, d);

            console.log("Distance: " + collision.distance.toString())
            console.log("Mag: " + collision.magnitude.toString())

            var distanceToMove = collision.getTravelDistance(speedVector, this.radius);
            speedVector = distanceToMove;
        }
        return speedVector;
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