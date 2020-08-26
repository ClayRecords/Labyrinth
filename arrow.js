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
        console.log("Clicked Arrow");
    }

    hover() {
        cursor('pointer');
    }
}


class DownArrow extends Arrow {
    constructor(col) {
        super(null, col);
        var glx = arrowMargin + arrowOffset + (col * tileSize);
        this.p1x = glx + (tileSize / 2.4);
        this.p1y = arrowOffset + (arrowMargin / 3);
        this.p2x = glx + tileSize - (tileSize / 2.4);
        this.p2y = arrowOffset + (arrowMargin / 3);
        this.p3x = glx + (tileSize / 2);
        this.p3y = arrowOffset + (arrowMargin * 2 / 3);
    }
}

class UpArrow extends Arrow {
    constructor(col) {
        super(null, col);
        var glx = arrowMargin + arrowOffset + (col * tileSize);
        var y = height - arrowOffset - arrowMargin;
        this.p1x = glx + (tileSize / 2.4);
        this.p1y = y + (arrowMargin * 2 / 3);
        this.p2x = glx + tileSize - (tileSize / 2.4);
        this.p2y = y + (arrowMargin * 2 / 3);
        this.p3x = glx + (tileSize / 2);
        this.p3y = y + (arrowMargin / 3);
    }
}

class RightArrow extends Arrow {
    constructor(row) {
        super(row, null);
        var gly = arrowMargin + arrowOffset + (row * tileSize);
        this.p1x = arrowOffset + (arrowMargin / 3);
        this.p1y = gly + (tileSize / 2.4);
        this.p2x = arrowOffset + (arrowMargin / 3);
        this.p2y = gly + tileSize - (tileSize / 2.4);
        this.p3x = arrowOffset + (arrowMargin * 2 / 3);
        this.p3y = gly + (tileSize / 2);
    }
}

class LeftArrow extends Arrow {
    constructor(row) {
        super(row, null);
        var gly = arrowMargin + arrowOffset + (row * tileSize);
        var x = width - arrowOffset - arrowMargin;
        this.p1x = x + (arrowMargin * 2 / 3);
        this.p1y = gly + (tileSize / 2.4);
        this.p2x = x + (arrowMargin * 2 / 3);
        this.p2y = gly + tileSize - (tileSize / 2.4);
        this.p3x = x + (arrowMargin / 3);
        this.p3y = gly + (tileSize / 2);
    }
}