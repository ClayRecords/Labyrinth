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
    ableToPush = true;
    arrows = makeArrows();
    player = new Player(grid[0][0], "red");
}

function makeGrid(cols, rows) {
    var grid = [];
    for (var x = 0; x < cols; x++) {
        grid[x] = [];
        for (var y = 0; y < rows; y++) {
            grid[x][y] = new GridTile(x, y, tileSize, x.toString() + "," + y.toString());
        }
    }
    extraTile = new GridTile(-1, -1, tileSize, "-1,-1");
    extraTile.position = new p5.Vector(0, 0);
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

    forEachTile(function () {
        this.update();
        this.show();
    });

    if (extraTile != null) {
        extraTile.update();
        extraTile.show();
    }

    for (var i = 0; i < arrows.length; i++) {
        var arrow = arrows[i];
        arrow.show();
    }

    player.update();
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

    $('.pushBtn').prop('disabled', !ableToPush);
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

    for (var x = 0; x < grid.length; x++) {
        if (grid[x] === undefined) { continue } // No tiles outside the x grid
        for (var y = 0; y < grid[x].length; y++) {
            if (grid[x][y] === undefined) { continue } // No tiles outside the y grid at x
            var tile = grid[x][y];
            if (!foundTarget && tile.isTarget(mouseX, mouseY)) {
                foundTarget = true;
                tile.click();
            }
            if (foundTarget) {
                return;
            }
        }
    }

    if (!foundTarget && extraTile != null && extraTile.isTarget(mouseX, mouseY)) {
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

var ableToPush = true;
function pushTileDown() {
    console.log("pushTileDown")
    if (ableToPush) {
        ableToPush = false;

        var newGridPositionX = 1;
        var newGridPositionY = -1;

        extraTile.pushIntoBoard(newGridPositionX, newGridPositionY);
        grid[newGridPositionX][newGridPositionY] = extraTile;
        extraTile = null;

        newGrid = [];
        for (var x = 0; x < grid.length; x++) {
            if (grid[x] === undefined) { continue }
            newGrid[x] = [];
            for (var y = -1; y < grid[x].length; y++) {
                if (grid[x][y] === undefined) { continue }
                var tile = grid[x][y];
                if (x == newGridPositionX) {
                    tile.pushY(1);
                    newGrid[x][y + 1] = tile;
                } else {
                    newGrid[x][y] = tile;
                }
            }
        }
        grid = newGrid;
    }
}

function pushTileUp() {
    console.log("pushTileUp")
    if (ableToPush) {
        ableToPush = false;

        var newGridPositionX = 1;
        var newGridPositionY = rows;

        extraTile.pushIntoBoard(newGridPositionX, newGridPositionY);
        grid[newGridPositionX][newGridPositionY] = extraTile;
        extraTile = null;

        newGrid = [];
        for (var x = 0; x < grid.length; x++) {
            if (grid[x] === undefined) { continue }
            newGrid[x] = [];
            for (var y = -1; y < grid[x].length; y++) {
                if (grid[x][y] === undefined) { continue }
                var tile = grid[x][y];
                if (x == newGridPositionX) {
                    tile.pushY(-1);
                    newGrid[x][y - 1] = tile;
                } else {
                    newGrid[x][y] = tile;
                }
            }
        }
        grid = newGrid;
    }
}

function pushDone(pushedTile) {
    ableToPush = true;
    forEachTile(function (x, y) {
        if (this == pushedTile) {
            grid[x][y] = undefined;
        }
    });
    extraTile = pushedTile;
    extraTile.position = new p5.Vector(0, 0);
    extraTile.gridPosition = null;
}

function forEachTile(func) {
    for (var x = -1; x < grid.length; x++) {
        if (grid[x] === undefined) { continue } // No tiles outside the x grid
        for (var y = -1; y < grid[x].length; y++) {
            if (grid[x][y] === undefined) { continue } // No tiles outside the y grid at x
            var tile = grid[x][y];
            func.apply(tile, [x, y]);
        }
    }
}