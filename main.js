var rows = 5;
var cols = 5;
var tileSize = 60;
var extraTileMargin = tileSize;
var arrowOffset = extraTileMargin;
var arrowMargin = 15;
var gridOffset = extraTileMargin + arrowMargin;
var gridHeight = rows * tileSize;
var gridWidth = cols * tileSize;
var grid;
var extraTile;
var arrows;
var player;
var shapes;


function setup() {
    var canvas = createCanvas(gridWidth + (gridOffset * 2), gridHeight + (gridOffset * 2));
    canvas.parent('canvasContainer');
    $('.p5Canvas').on('contextmenu', event => event.preventDefault());
    //frameRate(3)
    resetSketch(false);
}

function resetSketch(clear = true) {
    if (clear) console.clear();
    grid = makeGrid(cols, rows);
    extraTile = new Tile(0, 0, tileSize);
    arrows = makeArrows();
    player = new Player(grid[[0, 0]], "red");
}

function makeGrid(cols, rows) {
    var grid = {};
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            grid[[x, y]] = new GridTile(x, y, tileSize);
        }
    }
    return grid;
}

function makeArrows() {
    var arrows = [];
    for (var x = 0; x < cols; x++) {
        arrows.push(new DownArrow(x));
        arrows.push(new UpArrow(x));
    }
    for (var y = 0; y < rows; y++) {
        arrows.push(new RightArrow(y));
        arrows.push(new LeftArrow(y));
    }
    return arrows;
}

function draw() {
    shapes = [];
    background(255);
    cursor('default');
    mouseHovered();
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var tile = grid[Object.keys(grid)[xy]];
        tile.show();
    }

    extraTile.show();

    for (var i = 0; i < arrows.length; i++) {
        var arrow = arrows[i];
        arrow.show();
    }

    player.move();
    player.show();

    noFill();
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        if (shape["shape"] == "point") {
            point(shape["x"], shape["y"])
        } else if (shape["shape"] == "ellipse") {
            ellipse(shape["x"], shape["y"], shape["width"], shape["height"])
        } else if (shape["shape"] == "circle") {
            circle(shape["x"], shape["y"], shape["diameter"])
        }
    }
}

function mouseHovered() {
    var foundTarget = false;

    for (var i = 0; i < arrows.length; i++) {
        var arrow = arrows[i];
        if (!foundTarget && arrow.isTarget(mouseX, mouseY)) {
            foundTarget = true;
            arrow.hover();
        }
    }
}

function mousePressed() {
}

function mouseDragged() {
}

function mouseReleased() {
    var foundTarget = false;

    for (var i = 0; i < arrows.length; i++) {
        var arrow = arrows[i];
        if (!foundTarget && arrow.isTarget(mouseX, mouseY)) {
            foundTarget = true;
            arrow.click();
        }
        if (foundTarget) {
            return;
        }
    }

    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var tile = grid[Object.keys(grid)[xy]];
        if (!foundTarget && tile.isTarget(mouseX, mouseY)) {
            foundTarget = true;
            tile.click();
        }
        if (foundTarget) {
            return;
        }
    }

    if (!foundTarget && extraTile.isTarget(mouseX, mouseY)) {
        foundTarget = true;
        extraTile.click();
    }
}

function signOf(x) {
    if (x == 0) {
        return 0;
    }
    return x / Math.abs(x);
}

function roundToDigits(x, digits) {
    var place = 10 ** digits;
    return Math.round(x * place) / place;
}
