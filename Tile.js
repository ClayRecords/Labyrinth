
class Tile {
    constructor(lx, ly, size) {
        this.position = new p5.Vector(lx, ly)
        this.gridPosition = new p5.Vector();
        this.size = size;

        this.sections = this.makeSections();
    }

    makeSections() {
        var sections = {};
        var sectionSize = this.size / 3;
        var fullOffset = this.size * 2 / 3;
        var halfOffset = this.size * 1 / 3;

        sections[[0, 0]] = new Wall(this, this.position.x, this.position.y, sectionSize);
        sections[[2, 0]] = new Wall(this, this.position.x + fullOffset, this.position.y, sectionSize);
        sections[[0, 2]] = new Wall(this, this.position.x, this.position.y + fullOffset, sectionSize);
        sections[[2, 2]] = new Wall(this, this.position.x + fullOffset, this.position.y + fullOffset, sectionSize);

        this.randomizeWalls();

        var northClass = this.openNorth ? TileSection : Wall;
        sections[[1, 0]] = new northClass(this, this.position.x + halfOffset, this.position.y, sectionSize);

        var eastClass = this.openEast ? TileSection : Wall;
        sections[[2, 1]] = new eastClass(this, this.position.x + fullOffset, this.position.y + halfOffset, sectionSize);

        var southClass = this.openSouth ? TileSection : Wall;
        sections[[1, 2]] = new southClass(this, this.position.x + halfOffset, this.position.y + fullOffset, sectionSize);

        var westClass = this.openWest ? TileSection : Wall;
        sections[[0, 1]] = new westClass(this, this.position.x, this.position.y + halfOffset, sectionSize);

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
    constructor(gx, gy, size) {
        var lx = (gx * size) + gridOffset;
        var ly = (gy * size) + gridOffset;
        super(lx, ly, size);
        this.gridPosition = new p5.Vector(gx, gy);
    }
}


class TileSection {
    constructor(parentTile, lx, ly, size) {
        this.parentTile = parentTile;
        this.position = new p5.Vector(lx, ly);
        this.size = size;
        this.enterable = true;
    }

    show() {
        //Default is a blank section
    }
}

class Wall extends TileSection {
    constructor(parentTile, lx, ly, size) {
        super(parentTile, lx, ly, size);
        this.enterable = false;
        this.color = "yellow";
    }

    show() {
        fill(this.color);
        rect(this.position.x, this.position.y, this.size, this.size);
    }
}