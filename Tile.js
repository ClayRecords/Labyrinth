
class Tile {
    constructor(gx, gy, size) {
        this.gx = gx;
        this.gy = gy;
        this.size = size;
        this.lx = (this.gx * this.size) + gridOffset;
        this.ly = (this.gy * this.size) + gridOffset;

        this.sections = this.makeSections();
    }

    makeSections() {
        var sections = {};
        var sectionSize = this.size / 3;
        var fullOffset = this.size * 2 / 3;
        var halfOffset = this.size * 1 / 3;

        sections[[0, 0]] = new Wall(this, this.lx, this.ly, sectionSize);
        sections[[2, 0]] = new Wall(this, this.lx + fullOffset, this.ly, sectionSize);
        sections[[0, 2]] = new Wall(this, this.lx, this.ly + fullOffset, sectionSize);
        sections[[2, 2]] = new Wall(this, this.lx + fullOffset, this.ly + fullOffset, sectionSize);

        this.randomizeWalls();

        var northClass = this.openNorth ? TileSection : Wall;
        sections[[1, 0]] = new northClass(this, this.lx + halfOffset, this.ly, sectionSize);

        var eastClass = this.openEast ? TileSection : Wall;
        sections[[2, 1]] = new eastClass(this, this.lx + fullOffset, this.ly + halfOffset, sectionSize);

        var southClass = this.openSouth ? TileSection : Wall;
        sections[[1, 2]] = new southClass(this, this.lx + halfOffset, this.ly + fullOffset, sectionSize);

        var westClass = this.openWest ? TileSection : Wall;
        sections[[0, 1]] = new westClass(this, this.lx, this.ly + halfOffset, sectionSize);

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
        rect(this.lx, this.ly, this.size, this.size);
        strokeWeight(1);

        for (var xy = 0; xy < Object.keys(this.sections).length; xy++) {
            var section = this.sections[Object.keys(this.sections)[xy]];
            section.show();
        }
    }

    isTarget(x, y) {
        return pointRectangleCollision(x, y, this.lx, this.ly, this.size, this.size);
    }

    click() {
        var rightClicked = mouseButton == RIGHT;
        console.log("Clicked Tile");
    }
}

class TileSection {
    constructor(parentTile, lx, ly, size) {
        this.parentTile = parentTile;
        this.lx = lx;
        this.ly = ly;
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
    }

    show() {
        fill("yellow");
        rect(this.lx, this.ly, this.size, this.size);
    }
}