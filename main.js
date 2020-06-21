var rows = 5;
var cols = 5;
var tileSize = 60;
var grid;
var player;
var ableToMovePlayer = true;


function setup() {
    var canvas = createCanvas(cols * tileSize, rows * tileSize);
    canvas.parent('canvasContainer');
    $('.p5Canvas').on('contextmenu', event => event.preventDefault());
    resetSketch();
}

function resetSketch() {
    grid = makeGrid(cols, rows);
    player = new Player(grid[[0, 0]], "red");
}

function makeGrid(cols, rows) {
    var grid = {};
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            grid[[x, y]] = new Tile(x, y, tileSize);
        }
    }
    return grid;
}

function draw() {
    background(255);
    stroke(0);
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var tile = grid[Object.keys(grid)[xy]];
        tile.show();
    }

    player.move();
    player.show();
}

function mousePressed() {
    var foundTarget = false;
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var tile = grid[Object.keys(grid)[xy]];
        if (!foundTarget && tile.wasTarget()) {
            foundTarget = true;

        }
    }
}

function mouseDragged() {
    var foundTarget = false;
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var tile = grid[Object.keys(grid)[xy]];
        if (!foundTarget && tile.wasTarget()) {
            foundTarget = true;
        }
    }
}

function mouseReleased() {
    var foundTarget = false;
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var tile = grid[Object.keys(grid)[xy]];
        if (!foundTarget && tile.wasTarget()) {
            foundTarget = true;
            tile.click();
        }
    }
}
