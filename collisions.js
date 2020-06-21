function circleRect(cx, cy, radius, rx, ry, rw, rh) {

    // temporary variables to set edges for testing
    testX = cx;
    testY = cy;

    // which edge is closest?
    if (cx < rx) {// test left edge
        testX = rx;
    } else if (cx > rx + rw) {
        testX = rx + rw;// right edge
    }
    if (cy < ry) {// top edge
        testY = ry;
    } else if (cy > ry + rh) {// bottom edge
        testY = ry + rh;
    }

    // get distance from closest edges
    distX = cx - testX;
    distY = cy - testY;
    distance = Math.sqrt((distX * distX) + (distY * distY));

    // if the distance is less than the radius, collision!
    if (distance <= radius) {
        return true;
    }
    return false;
}