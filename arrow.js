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

    clicked(x, y) {
        if (this.isTarget(x, y)) {
            this.click();
            return true;
        }
        return false;
    }

    click() {
        console.log("clicked");
    }

    hovered(x, y) {
        if (this.isTarget(x, y)) {
            cursor('pointer');
            return true;
        }
        return false;
    }
}

class DownArrow extends Arrow {
    constructor(col) {
        super(null, col);
        this.p1x = gridOffset + (col * tileSize) + (tileSize / 3);
        this.p1y = gridOffset / 3;
        this.p2x = gridOffset + (col * tileSize) + (tileSize * 2 / 3);
        this.p2y = gridOffset / 3;
        this.p3x = gridOffset + (col * tileSize) + (tileSize / 2);
        this.p3y = gridOffset * 2 / 3;
    }
}

class UpArrow extends Arrow {
    constructor(col) {
        super(null, col);
    }
}
