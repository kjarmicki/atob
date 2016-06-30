'use strict';

export default function canvasRenderer(ctx, specs) {
    function clear() {
        ctx.fillStyle = specs.backgroundColor;
        ctx.fillRect(0, 0, specs.width, specs.height);
    }

    function drawPath(pointA, pointB) {
        ctx.strokeStyle = specs.lineColor;
        ctx.beginPath();
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.stroke();
    }

    return {clear, drawPath};
}