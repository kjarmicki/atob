export default function canvasRenderer(ctx, specs) {
    function clear() {
        ctx.fillStyle = specs.backgroundColor;
        ctx.fillRect(0, 0, specs.width, specs.height);
    }

    function drawPath(current, navigating) {
        // path
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(navigating.x, navigating.y);
        ctx.strokeStyle = specs.lineColor;
        ctx.stroke();

        // marker
        drawCurrentPosition(current);
    }

    function drawCurrentPosition(current) {
        drawCircle(current, specs.currentPositionColor);
    }

    function drawCircle(point, filling) {
        ctx.beginPath();
        ctx.fillStyle = filling;
        ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    return {clear, drawPath};
}