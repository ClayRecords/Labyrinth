
class Player {
    constructor(startingTile, color) {
        this.tileOn = startingTile;
        var offset = this.tileOn.size / 2;
        this.lx = startingTile.lx + offset;
        this.ly = startingTile.ly + offset;
        this.size = this.tileOn.size / 4;
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
            var speed = 2;
            var xSpeed = 0;
            var ySpeed = 0;
            if (keyIsDown(LEFT_ARROW)) {
                xSpeed -= speed;
            }
            if (keyIsDown(RIGHT_ARROW)) {
                xSpeed += speed;
            }
            if (keyIsDown(UP_ARROW)) {
                ySpeed -= speed;
            }
            if (keyIsDown(DOWN_ARROW)) {
                ySpeed += speed;
            }

            if (xSpeed != 0 || ySpeed != 0) {
                var speeds = this.checkBorderCollision(xSpeed, ySpeed);
                xSpeed = speeds[0];
                ySpeed = speeds[1];
            }

            if (xSpeed != 0 || ySpeed != 0) {
                var speeds = this.checkTileCollision(xSpeed, ySpeed);
                xSpeed = speeds[0];
                ySpeed = speeds[1];
            }

            if (xSpeed != 0 || ySpeed != 0) {
                this.lx += xSpeed;
                this.ly += ySpeed;
                this.getTileOn();
            }

        }
    }

    checkBorderCollision(xSpeed, ySpeed) {
        // If I keep moving in my current X direction, will I collide with the border?
        if (this.lx + xSpeed + (this.size / 2) > width - gridOffset) {
            this.lx = (width - gridOffset) - (this.size / 2);
            xSpeed = 0;
        } else if (this.lx + xSpeed - (this.size / 2) < gridOffset) {
            this.lx = gridOffset + this.size / 2;
            xSpeed = 0;
        }
        // If I keep moving in my current Y direction, will I collide with the border?
        if (this.ly + ySpeed + (this.size / 2) > height - gridOffset) {
            this.ly = (height - gridOffset) - (this.size / 2);
            ySpeed = 0;
        } else if (this.ly + ySpeed - (this.size / 2) < gridOffset) {
            this.ly = gridOffset + this.size / 2;
            ySpeed = 0;
        }
        return [xSpeed, ySpeed];
    }

    checkTileCollision(xSpeed, ySpeed) {
        var neighborTiles = this.getNeighborTiles();
        for (var n = 0; n < neighborTiles.length; n++) {
            var neighborTile = neighborTiles[n];
            for (var xy = 0; xy < Object.keys(neighborTile.sections).length; xy++) {
                var neighborSection = neighborTile.sections[Object.keys(neighborTile.sections)[xy]];
                if (!neighborSection.enterable) {
                    // If I keep moving in my current X direction, will I collide with this section?
                    if (circleRect(this.lx + xSpeed, this.ly, this.size / 2,
                        neighborSection.lx, neighborSection.ly, neighborSection.size, neighborSection.size)) {
                        xSpeed = 0;
                    }
                    // If I keep moving in my current Y direction, will I collide with this section?
                    if (circleRect(this.lx, this.ly + ySpeed, this.size / 2,
                        neighborSection.lx, neighborSection.ly, neighborSection.size, neighborSection.size)) {
                        ySpeed = 0;
                    }
                }
                if (xSpeed == 0 && ySpeed == 0) {
                    break;
                }
            }
            if (xSpeed == 0 && ySpeed == 0) {
                break;
            }
        }
        return [xSpeed, ySpeed];
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