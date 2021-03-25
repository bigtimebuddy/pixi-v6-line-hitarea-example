import { Application, Graphics, Polygon } from 'pixi.js';

const app = new Application({
    width: 200, 
    height: 200,
    antialias: false
});
document.body.appendChild(app.view);

const line = new Graphics()
	.lineStyle(6, 0xffffff)
    .moveTo(0, 0)
    .bezierCurveTo(50, 0, 50, 100, 100, 100);

line.position.set(50);
line.buttonMode = true;
line.interactive = true;

const shape = lineToPolygon(
    line.line.width * 2,
    line.currentPath.points
);

line.lineStyle(1, 0xff0000);
line.drawShape(shape);
line.hitArea = shape;
 
function lineToPolygon(distance: number, points: number[]) {
	const numPoints = points.length / 2;
    const output = new Array(points.length * 2);
    for (let i = 0; i < numPoints; i++) {
        const j = i * 2;
        
        // Position of current point
        const x = points[j];
        const y = points[j + 1];
        
        // Start
        const x0 = points[j - 2] !== undefined ? points[j - 2] : x;
        const y0 = points[j - 1] !== undefined ? points[j - 1] : y;
        
        // End
        const x1 = points[j + 2] !== undefined ? points[j + 2] : x;
        const y1 = points[j + 3] !== undefined ? points[j + 3] : y;
            
        // Get the angle of the line
        const a = Math.atan2(-x1 + x0, y1 - y0);
        const deltaX = distance * Math.cos(a);
        const deltaY = distance * Math.sin(a);
        
        // Add the x, y at the beginning
        output[j] = x + deltaX;
        output[j + 1] = y + deltaY;
        
        // Add the reflected x, y at the end
        output[(output.length - 1) - j - 1] = x - deltaX;
        output[(output.length - 1) - j] = y - deltaY;
    }
    // close the shape
    output.push(output[0], output[1]);
    
    return new Polygon(output);
}

app.stage.addChild(line);
