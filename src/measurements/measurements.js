'use strict';

import assign from 'object-assign';

export default {coordsToPx, scalePointsToQuadraticArea, transformPointsMatrix, rotatePointsMatrix};

function coordsToPx(coords, area) {
    const x = (area.width/360) * (180 + coords.longitude);
    const y = (area.height/180) * (90 - coords.latitude);

    return {x, y};
}

function pickNumber(a, b, decider) {
    a = typeof a === 'number' ? a : b;
    return decider(a, b);
}

function scalePointsToQuadraticArea(points, sideWidth) {
    let maxX, maxY, minX, minY;
    points.forEach(point => {
        maxX = pickNumber(maxX, point.x, Math.max);
        maxY = pickNumber(maxY, point.y, Math.max);
        minX = pickNumber(minX, point.x, Math.min);
        minY = pickNumber(minY, point.y, Math.min);
    });
    let diffX = maxX - minX;
    let diffY = maxY - minY;

    let chosenDiff = Math.max(diffX, diffY);
    if(chosenDiff === 0) {
        chosenDiff = sideWidth;
    }
    const scale = sideWidth / chosenDiff;

    return points.map(point => {
        point.x = (point.x - minX) * scale;
        point.y = (point.y - minY) * scale;
        return point;
    });
}

function transformPointsMatrix(points, transformX, transformY) {
    return points.map(point => {
        const cloned = assign({}, point);
        point.x = transformX(cloned.x, cloned.y);
        point.y = transformY(cloned.x, cloned.y);
        return point;
    });
}

function rotatePointsMatrix(points, origin, angle) {
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    return transformPointsMatrix(points,
        (x, y) => (cos * (x - origin.x)) + (sin * (y - origin.y)) + origin.x,
        (x, y) => (cos * (y - origin.y)) - (sin * (x - origin.x)) + origin.y
    );
}