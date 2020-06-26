class Arrow {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    show() {
        stroke(0);
        fill("blue");
        triangle(this.p1x, this.p1y, this.p2x, this.p2y, this.p3x, this.p3y);
    }

    isTarget(x, y) {
        return pointTriangleCollision(x, y, this.p1x, this.p1y, this.p2x, this.p2y, this.p3x, this.p3y);
    }

    click() {
        console.log("clicked Arrow");
    }

    hover() {
        cursor('pointer');
    }
}


class DownArrow extends Arrow {
    constructor(col) {
        super(null, col);
        var glx = col * tileSize;
        this.p1x = gridOffset + glx + (tileSize / 3);
        this.p1y = gridOffset / 3;
        this.p2x = gridOffset + glx + (tileSize * 2 / 3);
        this.p2y = gridOffset / 3;
        this.p3x = gridOffset + glx + (tileSize / 2);
        this.p3y = gridOffset * 2 / 3;
    }
}

class UpArrow extends Arrow {
    constructor(col) {
        super(null, col);
        var glx = col * tileSize;
        this.p1x = gridOffset + glx + (tileSize / 3);
        this.p1y = gridHeight + gridOffset + (gridOffset * 2 / 3);
        this.p2x = gridOffset + glx + (tileSize * 2 / 3);
        this.p2y = gridHeight + gridOffset + (gridOffset * 2 / 3);
        this.p3x = gridOffset + glx + (tileSize / 2);
        this.p3y = gridHeight + gridOffset + (gridOffset / 3);
    }
}

class RightArrow extends Arrow {
    constructor(row) {
        super(row, null);
        var gly = row * tileSize;
        this.p1x = gridOffset / 3;
        this.p1y = gridOffset + gly + (tileSize / 3)
        this.p2x = gridOffset / 3;
        this.p2y = gridOffset + gly + (tileSize * 2 / 3);
        this.p3x = gridOffset * 2 / 3;
        this.p3y = gridOffset + gly + (tileSize / 2);
    }
}

class LeftArrow extends Arrow {
    constructor(row) {
        super(row, null);
        var gly = row * tileSize;
        this.p1x = gridWidth + gridOffset + (gridOffset * 2 / 3);
        this.p1y = gridOffset + gly + (tileSize / 3)
        this.p2x = gridWidth + gridOffset + (gridOffset * 2 / 3);
        this.p2y = gridOffset + gly + (tileSize * 2 / 3);
        this.p3x = gridWidth + gridOffset + (gridOffset / 3);
        this.p3y = gridOffset + gly + (tileSize / 2);
    }
}