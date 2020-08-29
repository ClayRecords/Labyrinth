
function circleRectangleCollision(cx, cy, radius, rx, ry, rw, rh) {

    // temporary variables to set edges for testing
    testX = cx;
    testY = cy;

    // which edge is closest?
    if (cx < rx) {// left edge
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

function getDistanceFromCircleToRectangle(cx, cy, rx, ry, rw, rh) {
    // temporary variables to set edges for testing
    testX = cx;
    testY = cy;

    // which edge is closest?
    if (cx < rx) {// left edge
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
    distX = testX - cx;
    distY = testY - cy;
    distance = new p5.Vector(distX, distY);

    return distance;
}

function pointTriangleCollision(px, py, x1, y1, x2, y2, x3, y3) {
    // get the area of the triangle
    var areaOrig = floor(abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)));
    //console.log("totalArea: " + areaOrig);

    // get the area of 3 triangles made between the point and the corners of the triangle
    var area1 = floor(abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)));
    var area2 = floor(abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py)));
    var area3 = floor(abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py)));
    //console.log("areaSum: " + (area1 + area2 + area3));

    // if the sum of the three areas equals the original, we're inside the triangle
    if (area1 + area2 + area3 <= areaOrig) {
        return true;
    }
    return false;
}

function pointRectangleCollision(px, py, rx, ry, width, height) {
    return (px > rx && px < (rx + width) && py > ry && py < ry + height);
}

class PlayerTileRelationship{
    constructor(object, distance) {
        this.object = object;
        this.distance = distance;
        this.magnitude = distance.mag();
    }

    isACollision(radius) {
        return Math.abs(this.magnitude) - 1 < radius;
    }

    getTravelDistance(speed, radius) {
        var travelDistance = new p5.Vector(speed.x, speed.y);
        if (speed.x != 0 && this.distance.y == 0) {
            // There is a purely horizontal collision
            travelDistance.x = this.getComponentTravelDistance(this.distance.x, radius);
        } else if (speed.y != 0 && this.distance.x == 0) {
            // There is a purely vertical collision
            travelDistance.y = this.getComponentTravelDistance(this.distance.y, radius);
        } else {
            // There is a horizontal collision and vertical collision
            var movementDistance = this.magnitude - radius - 1;

            if (speed.x != 0) {
                var xMovementDistance = this.getRatiodTravelDistance(this.distance.x, movementDistance)
                travelDistance.x = xMovementDistance;
            }

            if (speed.y != 0) {
                var yMovementDistance = this.getRatiodTravelDistance(this.distance.y, movementDistance)
                travelDistance.y = yMovementDistance;
            }
        }
        return travelDistance;
    }

    getComponentTravelDistance(componentDistance, radius) {
        var sign = signOf(componentDistance);
        var travelDistance = componentDistance - (radius * sign) - sign;
        return travelDistance;
    }

    getRatiodTravelDistance(componentDistance, movementDistance) {
        var ratio = componentDistance / this.magnitude;
        var travelDistance = ratio * movementDistance;
        return travelDistance;
    }
}