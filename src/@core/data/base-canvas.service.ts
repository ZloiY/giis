import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class BaseCanvasService {
  protected interval = null;
  protected canvas: HTMLCanvasElement;
  protected tileSize: number;

  constructor(protected logger: NGXLogger) {
    this.interval = Observable
      .interval(1000 /*ms*/)
      .timeInterval();
  }

  setTileSize(tileSize) {
    this.tileSize = tileSize;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  drawGrid() {
    const canvasContext = this.canvas.getContext('2d');
    canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    canvasContext.beginPath();
    for (let horizCoord = 0; horizCoord < this.canvas.width; horizCoord += Number(this.tileSize)) {
      canvasContext.moveTo(horizCoord, 0);
      canvasContext.lineTo(horizCoord, this.canvas.height);
    }
    for (let vertCoord = 0; vertCoord < this.canvas.height; vertCoord += Number(this.tileSize)) {
      canvasContext.moveTo(0, vertCoord);
      canvasContext.lineTo(this.canvas.width, vertCoord);
    }
    canvasContext.stroke();
    canvasContext.closePath();
  }

  createTile(xCoord: number, yCoord: number, opacity: number = 1) {
    const context = this.canvas.getContext('2d');
    context.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    console.log(opacity);
    context.fillRect(xCoord * this.tileSize, yCoord * this.tileSize, this.tileSize, this.tileSize);
  }
}
