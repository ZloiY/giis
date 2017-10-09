import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/observable/interval';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class CanvasService {

  interval = null;

  constructor(private logger: NGXLogger) {
    this.interval = Observable
      .interval(1000 /*ms*/)
      .timeInterval();
  }

  drawGrid(canvas, tileSize: number) {
    const canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.beginPath();
    for (let horizCoord = 0; horizCoord < canvas.width; horizCoord += Number(tileSize)) {
      canvasContext.moveTo(horizCoord, 0);
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

  drawLine(canvas, line, tileSize: number, debug: boolean = false) {
    const length = Math.max(Math.abs(line.x2 - line.x1), Math.abs(line.y2 - line.y1));
    const dx = (line.x2 - line.x1) / length;
    const dy = (line.y2 - line.y1) / length;
    let x = line.x1 + 0.5;
    let y = line.y1 + 0.5;
    this.logger.info('Start drawing...');
    this.logger.info(`x:${x}, y:${y}`);
    this.createTile(canvas, Math.floor(x) * tileSize, Math.floor(y) * tileSize, tileSize);
    let pointId = 0;
    if (debug) {
     const subscription = this.interval.subscribe(() => {
        x = x + dx;
        y = y + dy;
        this.logger.info(`x:${x}, y:${y}`);
        this.createTile(canvas, Math.floor(x) * tileSize, Math.floor(y) * tileSize, tileSize);
        pointId++;
        if (pointId >= length) {
          subscription.unsubscribe();
          this.logger.info('End drawing.');
        }
      });
    } else {
      while (pointId < length) {
        x = x + dx;
        y = y + dy;
        this.logger.info(`x:${x}, y:${y}`);
        this.createTile(canvas, Math.floor(x) * tileSize, Math.floor(y) * tileSize, tileSize);
        pointId++;
      }
      this.logger.info('End drawing.');
    }
  }

  drawBrezenhemLine(canvas, line, tileSize: number, debug: boolean = false) {
    const length = Math.max(Math.abs(line.x2 - line.x1), Math.abs(line.y2 - line.y1));
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    let x = line.x1;
    let y = line.y1;
    let e = 2 * dy - dx;
    this.logger.info('Start drawing...');
    this.logger.info(`x:${x}, y:${y}`);
    this.createTile(canvas, x * tileSize, y * tileSize, tileSize);
    let iterationId = 0;
    if (debug) {
      const subscription = this.interval.subscribe(() => {
      if (e >= 0) {
        y += 1;
        e -= 2 * dx;
      }
      x += 1;
      e += 2 * dy;
      iterationId++;
      this.logger.info(`x:${x}, y:${y}`);
      this.createTile(canvas, x * tileSize, y * tileSize, tileSize);
        if (iterationId >= length) {
          subscription.unsubscribe();
          this.logger.info('End drawing.');
        }
      });
    } else {
      while (iterationId >= length) {
        if (e >= 0) {
          y += 1;
          e -= 2 * dx;
        }
        x += 1;
        e += 2 * dy;
        iterationId++;
        this.logger.info(`x:${x}, y:${y}`);
        this.createTile(canvas, x * tileSize, y * tileSize, tileSize);
      }
      this.logger.info('End drawing.');
    }
  }

  createTile(canvas, xAxis: number, yAxis: number, tileSize: number) {
    const context = canvas.getContext('2d');
    context.fillRect(xAxis, yAxis, tileSize, tileSize);
  }
}
