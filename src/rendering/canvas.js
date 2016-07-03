'use strict';

export default function canvasRenderer(ctx, specs) {
    function clear() {
        ctx.fillStyle = specs.backgroundColor;
        ctx.fillRect(0, 0, specs.width, specs.height);
    }

    function drawPath(current, navigating) {
        ctx.strokeStyle = specs.lineColor;
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(navigating.x, navigating.y);
        ctx.stroke();
    }

    return {clear, drawPath};
}