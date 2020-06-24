var rows = 5;
var cols = 5;
var tileSize = 60;
var gridOffset = 30;
var grid;
var arrows;
var player;
var ableToMovePlayer = true;


function setup() {
    var canvas = createCanvas((cols * tileSize) + (gridOffset * 2), (rows * tileSize) + (gridOffset * 2));
    canvas.parent('canvasContainer');
    $('.p5Canvas').on('contextmenu', event => event.preventDefault());
    resetSketch();
}

function resetSketch() {
    grid = makeGrid(cols, rows);
    arrows = makeArrows();
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

function makeArrows() {
    var arrows = [];
    for (var x = 0; x < cols; x++) {
        arrows.push(new DownArrow(x));
    }
    for (var y = 0; y < rows; y++) {
    }
    return arrows;
}

function draw() {
    background(255);
    stroke(0);
    cursor('default');
    mouseHovered()
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var tile = grid[Object.keys(grid)[xy]];
        tile.show();
    }

    for (var i = 0; i < arrows.length; i++) {
        var arrow = arrows[i];
        arrow.show();
    }

    player.move();
    player.show();
}

function mouseHovered() {
    var foundTarget = false;

    for (var i = 0; i < arrows.length; i++) {
        var arrow = arrows[i];
        if (!foundTarget && arrow.hovered(mouseX, mouseY)) {
            foundTarget = true;
        }
    }
}

function mousePressed() {
    
}

function mouseDragged() {
    var foundTarget = false;
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var tile = grid[Object.keys(grid)[xy]];
        if (!foundTarget && tile.isTarget(mouseX, mouseY)) {
            foundTarget = true;
        }
    }
}

function mouseReleased() {
    var foundTarget = false;

    for (var i = 0; i < arrows.length; i++) {
        var arrow = arrows[i];
        if (!foundTarget && arrow.clicked(mouseX, mouseY)) {
            foundTarget = true;
        }
    }

    if (foundTarget) return;

    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var tile = grid[Object.keys(grid)[xy]];
        if (!foundTarget && tile.clicked(mouseX, mouseY)) {
            foundTarget = true;

        }
    }
}
