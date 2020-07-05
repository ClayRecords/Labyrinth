var playerSpeed = 1;
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
                this.checkBorderCollision(speedVector);
            }

            if (speedVector.x != 0 || speedVector.y != 0) {
                this.checkTileCollision(speedVector);
            }

            if (speedVector.x != 0 || speedVector.y != 0) {
                this.lx += speedVector.x;
                this.ly += speedVector.y;
                this.getTileOn();
            }
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
        var neighborTiles = this.getNeighborTiles();
        for (var n = 0; n < neighborTiles.length; n++) {
            var neighborTile = neighborTiles[n];
            for (var xy = 0; xy < Object.keys(neighborTile.sections).length; xy++) {
                var neighborSection = neighborTile.sections[Object.keys(neighborTile.sections)[xy]];
                if (!neighborSection.enterable) {
                    // If I keep moving in my current X direction, will I collide with this section?
                    if (circleRectangleCollision(this.lx + speedVector.x, this.ly, this.radius,
                        neighborSection.lx, neighborSection.ly, neighborSection.size, neighborSection.size)) {

                        console.log("---- X Collision ----")
                        console.log("Position: " + this.lx.toString())
                        console.log("Radius: " + this.radius.toString())
                        console.log("Speed: " + speedVector.x.toString())

                        console.log("Neighbor Position: " + neighborSection.lx.toString())
                        console.log("Neighbor Size: " + neighborSection.size.toString())

                        var d = getDistanceFromCircleToRectangle(this.lx, this.ly, this.radius,
                            neighborSection.lx, neighborSection.ly, neighborSection.size, neighborSection.size);
                        console.log(d.toString())

                        var td = Math.sqrt((d.x * d.x) + (d.y * d.y))
                        console.log("td: " + td.toString())
                        var ratio = this.radius / td;
                        ratio = (1 - Math.abs(ratio)) * (ratio / Math.abs(ratio))
                        d.mult(ratio)
                        console.log("newD: " + d.toString())

                        if (d.x != 0) {
                            xDistanceToMove = d.x - (d.x / Math.abs(d.x));
                            this.lx = this.lx + xDistanceToMove;
                        } else if (speedVector.x != 0) {
                            console.warn("Centered on x")
                            var xDistanceToMove = this.radius * (-speedVector.x / Math.abs(speedVector.x));
                            xDistanceToMove = xDistanceToMove - (speedVector.x / Math.abs(speedVector.x));
                            this.lx = this.lx + xDistanceToMove;
                        } else {
                            console.warn("Here x")
                        }
                        console.log("Set position to: " + this.lx.toString())
                        speedVector.x = 0;
                    }
                    // If I keep moving in my current Y direction, will I collide with this section?
                    if (circleRectangleCollision(this.lx, this.ly + speedVector.y, this.radius,
                        neighborSection.lx, neighborSection.ly, neighborSection.size, neighborSection.size)) {

                        console.log("---- Y Collision ----")
                        console.log("Position: " + this.ly.toString())
                        console.log("Radius: " + this.radius.toString())
                        console.log("Speed: " + speedVector.y.toString())

                        console.log("Neighbor Position: " + neighborSection.ly.toString())
                        console.log("Neighbor Size: " + neighborSection.size.toString())

                        var d = getDistanceFromCircleToRectangle(this.lx, this.ly, this.radius,
                            neighborSection.lx, neighborSection.ly, neighborSection.size, neighborSection.size);
                        console.log(d.toString())

                        var td = Math.sqrt((d.x * d.x) + (d.y * d.y))
                        console.log("td: " + td.toString())
                        var ratio = this.radius / td;
                        ratio = (1 - Math.abs(ratio)) * (ratio / Math.abs(ratio))
                        d.mult(ratio)
                        console.log("newD: " + d.toString())

                        if (d.y != 0) {
                            yDistanceToMove = d.y - (d.y / Math.abs(d.y));
                            this.ly = this.ly + yDistanceToMove;
                        } else if (speedVector.y != 0) {
                            console.warn("Centered on y")
                            var yDistanceToMove = this.radius * (-speedVector.y / Math.abs(speedVector.y));
                            yDistanceToMove = yDistanceToMove - (speedVector.y / Math.abs(speedVector.y));
                            this.ly = this.ly + yDistanceToMove;
                        } else {
                            console.warn("Here y")
                        }

                        console.log("Set position to: " + this.ly.toString())
                        speedVector.y = 0;
                    }
                }
                if (speedVector.x == 0 && speedVector.y == 0) {
                    break;
                }
            }
            if (speedVector.x == 0 && speedVector.y == 0) {
                break;
            }
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