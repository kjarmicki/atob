'use strict';

function pickNumber(a, b, decider) {
    a = typeof a === 'number' ? a : b;
    return decider(a, b);
}

export default {
    coordsToPx(coords, area) {
        const x = (area.width/360) * (180 + coords.longitude);
        const y = (area.height/180) * (90 - coords.latitude);

        return {x, y};
    },

    scalePointsToQuadraticArea(points, sideWidth, padding) {
        let maxX, maxY, minX, minY;
        points.forEach(point => {
            maxX = pickNumber(maxX, point.x, Math.max);
            maxY = pickNumber(maxY, point.y, Math.max);
            minX = pickNumber(minX, point.x, Math.min);
            minY = pickNumber(minY, point.y, Math.min);
        });
        let diffX = maxX - minX;
        if(diffX === 0) {
            diffX = sideWidth;
        }
        let scale = sideWidth / diffX;

        return points.map(point => {
            point.x = (point.x - minX) * scale;
            point.y = (point.y - minY) * scale;
            return point;
        });
    }
};