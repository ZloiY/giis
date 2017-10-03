import { Injectable } from '@angular/core';

@Injectable()
export class Lab1Service {

  constructor() { }

  drawGrid(canvas, tileSize) {
    const canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.beginPath();
    for (let horizCoord = 0; horizCoord < canvas.width; horizCoord += Number(tileSize)) {
      canvasContext.moveTo(horizCoord,0);
      canvasContext.lineTo(horizCoord, canvas.height);
      canvasContext.stroke();
    }
    for (let vertCoord = 0; vertCoord < canvas.height; vertCoord += Number(tileSize)) {
      canvasContext.moveTo(0, vertCoord);
      canvasContext.lineTo(canvas.width, vertCoord);
      canvasContext.stroke();
    }
    canvasContext.closePath();
  }

  drawLine(canvas, line, tileSize: number) {
    const length = Math.max(Math.abs(line.x2 - line.x1), Math.abs(line.y2 - line.y1));
    const dx = (line.x2 - line.x1) / length;
    const dy = (line.y2 - line.y1) / length;
    let x = line.x1 + 0.5;
    let y = line.y1 + 0.5;
    this.createTile(canvas, Math.floor(x) * tileSize, Math.floor(y) * tileSize, tileSize);
    let pointId = 0;
    while (pointId < length) {
      x = x + dx;
      y = y + dy;
      this.createTile(canvas, Math.floor(x) * tileSize, Math.floor(y) * tileSize, tileSize);
      pointId++;
    }
  }

  createTile(canvas, xAxis: number, yAxis: number, tileSize: number) {
    const context = canvas.getContext('2d');
    context.fillRect(xAxis, yAxis, tileSize, tileSize);
  }
}
