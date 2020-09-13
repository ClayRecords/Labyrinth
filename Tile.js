var tileSpeed = 2;

class Tile {
    constructor(lx, ly, size, sections = null) {
        this.position = new p5.Vector(lx, ly);
        this.moveToPosition = null;
        this.gridPosition = new p5.Vector();
        this.size = size;

        if (sections === null) {
            this.sections = this.makeSections();
        } else {
            this.sections = sections;
            for (var xy = 0; xy < Object.keys(this.sections).length; xy++) {
                var section = this.sections[Object.keys(this.sections)[xy]];
                section.parentTile = this;
            }
        }
    }

    makeSections() {
        var sections = {};
        var sectionSize = this.size / 3;
        var fullOffset = this.size * 2 / 3;
        var halfOffset = this.size * 1 / 3;

        sections[[0, 0]] = new Wall(this, 0, 0, sectionSize);
        sections[[2, 0]] = new Wall(this, fullOffset, 0, sectionSize);
        sections[[0, 2]] = new Wall(this, 0, fullOffset, sectionSize);
        sections[[2, 2]] = new Wall(this, fullOffset, fullOffset, sectionSize);

        this.randomizeWalls();

        var northClass = this.openNorth ? TileSection : Wall;
        sections[[1, 0]] = new northClass(this, halfOffset, 0, sectionSize);

        var eastClass = this.openEast ? TileSection : Wall;
        sections[[2, 1]] = new eastClass(this, fullOffset, halfOffset, sectionSize);

        var southClass = this.openSouth ? TileSection : Wall;
        sections[[1, 2]] = new southClass(this, halfOffset, fullOffset, sectionSize);

        var westClass = this.openWest ? TileSection : Wall;
        sections[[0, 1]] = new westClass(this, 0, halfOffset, sectionSize);

        return sections;
    }

    randomizeWalls() {
        this.openNorth = floor(random(2)) != 0;
        this.openEast = floor(random(2)) != 0;
        this.openSouth = floor(random(2)) != 0;
        this.openWest = floor(random(2)) != 0;
        while ((this.openNorth + this.openEast + this.openSouth + this.openWest) < 2) {
            this.randomizeWalls();
        }
    }

    update() {
        if (this.moveToPosition != null && !this.position.equals(this.moveToPosition)) {
            this.move();
        }

        this.updateSections();
    }

    move() {
        var speed = new p5.Vector(0, 0);
        if (this.position.x != this.moveToPosition.x) {
            var dist = this.moveToPosition.x - this.position.x;
            if (Math.abs(dist) > tileSpeed) {
                speed.x = tileSpeed * signOf(dist);
            } else {
                speed.x = dist;
            }
        }

        if (this.position.y != this.moveToPosition.y) {
            var dist = this.moveToPosition.y - this.position.y;
            if (Math.abs(dist) > tileSpeed) {
                speed.y = tileSpeed * signOf(dist);
            } else {
                speed.y = dist;
            }
        }

        this.position.x += speed.x;
        this.position.y += speed.y;

        if (this.position.equals(this.moveToPosition)) {
            if (this.position.y >= height - gridOffset - 1) {
                pushDone(this);
            }
            this.moveToPosition = null;
        }
    }

    updateSections() {
        for (var xy = 0; xy < Object.keys(this.sections).length; xy++) {
            var section = this.sections[Object.keys(this.sections)[xy]];
            section.update();
        }
    }

    show() {
        stroke(0);
        noFill();
        strokeWeight(2);
        rect(this.position.x, this.position.y, this.size, this.size);
        strokeWeight(1);

        for (var xy = 0; xy < Object.keys(this.sections).length; xy++) {
            var section = this.sections[Object.keys(this.sections)[xy]];
            section.show();
        }
    }

    isTarget(x, y) {
        return pointRectangleCollision(x, y, this.position.x, this.position.y, this.size, this.size);
    }

    click() {
        var rightClicked = mouseButton == RIGHT;
        console.log("Clicked Tile");
    }
}

class GridTile extends Tile {
    constructor(gx, gy, size, sections = null) {
        var lx = (gx * size) + gridOffset;
        var ly = (gy * size) + gridOffset;
        super(lx, ly, size, sections);
        this.gridPosition = new p5.Vector(gx, gy);
    }
}


class TileSection {
    constructor(parentTile, positionOffsetX, positionOffsetY, size) {
        this.parentTile = parentTile;
        this.positionOffsetX = positionOffsetX;
        this.positionOffsetY = positionOffsetY;
        this.update();
        this.size = size;
        this.enterable = true;
    }

    update() {
        var posX = this.parentTile.position.x + this.positionOffsetX;
        var posY = this.parentTile.position.y + this.positionOffsetY;
        this.position = new p5.Vector(posX, posY);
    }

    show() {
        //Default is a blank section
    }
}

class Wall extends TileSection {
    constructor(parentTile, positionOffsetX, positionOffsetY, size) {
        super(parentTile, positionOffsetX, positionOffsetY, size);
        this.enterable = false;
        this.color = "yellow";
    }

    show() {
        fill(this.color);
        rect(this.position.x, this.position.y, this.size, this.size);
    }
}