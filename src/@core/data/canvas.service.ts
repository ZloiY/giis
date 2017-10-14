import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/observable/interval';

import { NGXLogger } from 'ngx-logger';
import { Line } from '../line.model';

@Injectable()
export class CanvasService {

  private interval = null;
  private canvas: HTMLCanvasElement;
  private tileSize: number;

  constructor(private logger: NGXLogger) {
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

  drawLine(line: Line, debug: boolean = false) {
    const length = Math.max(Math.abs(line.x2 - line.x1), Math.abs(line.y2 - line.y1));
    const dx = (line.x2 - line.x1) / length;
    const dy = (line.y2 - line.y1) / length;
    let x = line.x1 + 0.5;
    let y = line.y1 + 0.5;
    this.logger.info('Start drawing...');
    this.logger.info(`x:${x}, y:${y}`);
    this.createTile(Math.floor(x), Math.floor(y));
    let pointId = 0;
    if (debug) {
     const subscription = this.interval.subscribe(() => {
        x = x + dx;
        y = y + dy;
        this.logger.info(`x:${x}, y:${y}`);
        this.createTile(Math.floor(x), Math.floor(y));
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
        this.createTile(Math.floor(x), Math.floor(y));
        pointId++;
      }
      this.logger.info('End drawing.');
    }
  }

  drawBrezenhemLine(line: Line,  debug: boolean = false) {
    const length = Math.max(Math.abs(line.x2 - line.x1), Math.abs(line.y2 - line.y1));
    const dx = Math.abs(line.x2 - line.x1);
    const dy = Math.abs(line.y2 - line.y1);
    const signX = Math.sign(line.x2 - line.x1);
    const signY = Math.sign(line.y2 - line.y1);
    let x = line.x1;
    let y = line.y1;
    let e = 2 * dy - dx;
    this.logger.info('Start drawing...');
    this.logger.info(`x:${x}, y:${y}`);
    this.createTile(x, y);
    let iterationId = 0;
    if (debug) {
      const subscription = this.interval.subscribe(() => {
      if (e >= 0) {
        y += signY;
        e -= 2 * dx;
      }
      x += signX;
      e += 2 * dy;
      iterationId++;
      this.logger.info(`x:${x}, y:${y}`);
      this.createTile(x, y);
        if (iterationId >= length) {
          subscription.unsubscribe();
          this.logger.info('End drawing.');
        }
      });
    } else {
      while (iterationId <= length) {
        if (e >= 0) {
          y += signY;
          e -= 2 * dx;
        }
        x += signX;
        e += 2 * dy;
        iterationId++;
        this.logger.info(`x:${x}, y:${y}`);
        this.createTile(x, y);
      }
      this.logger.info('End drawing.');
    }
  }

  drawVuLine(line: Line, debug: boolean = false) {
    const dx = Math.abs(line.x2 - line.x1);
    const dy = Math.abs(line.y2 - line.y1);
    const signX = Math.sign(line.x2 - line.x1);
    const signY = Math.sign(line.y2 - line.y1);
    const params = {
      dx: dx,
      dy: dy,
      signX: signX,
      signY: signY,
    };
    if (dx === 0 || dy === 0) {
      this.drawLine(line, debug);
      return;
    }
    this.logger.info('Start drawing...');
    if (dy < dx) {
      debug ? this.drawByXDebug(line, params) : this.drawByX(line, params);
    } else {
      debug ? this.drawByYDebug(line, params) : this.drawByY(line, params);
    }
    this.logger.info('End drawing.');
  }

  drawByX(line, params) {
    const length = Math.abs(line.x2 - line.x1);
    const angle = params.dy / params.dx;
    this.logger.info(`x: ${line.x1}, y: ${line.y1}`);
    this.createTile(line.x1, line.y1);
    let iterationId = 1;
    let x = line.x1;
    let y = line.y1 + angle * params.signY;
    while (iterationId < length) {
      x += params.signX;
      this.logger.info(`x: ${x}, y: ${Math.floor(y)}`);
      this.createTile(x, Math.floor(y), 1 - (y % 1));
      this.logger.info(`x: ${x}, y: ${Math.floor(y) + 1}`);
      this.createTile(x, (Math.floor(y) + 1), y % 1);
      y += angle * params.signY;
      iterationId++;
    }
    this.logger.info(`x: ${line.x2}, y: ${line.y2}`);
    this.createTile(line.x2, line.y2);
  }

  drawByXDebug(line, params) {
    const length = Math.abs(line.x2 - line.x1);
    const angle = params.dy / params.dx;
    this.logger.info(`x: ${line.x1}, y: ${line.y1}`);
    this.createTile(line.x1, line.y1);
    let iterationId = 1;
    let x = line.x1;
    let y = line.y1 + angle * params.signY;
    const subscription = this.interval.subscribe(() => {
      if (iterationId % 2) {
        x += params.signX;
        this.logger.info(`x: ${x}, y: ${Math.floor(y)}`);
        this.createTile(x, Math.floor(y), 1 - (y % 1));
      } else {
        this.logger.info(`x: ${x}, y: ${Math.floor(y) + 1}`);
        this.createTile(x, (Math.floor(y) + 1), y % 1);
        y += angle * params.signY;
      }
      iterationId++;
      if (iterationId > length * 2) {
        subscription.unsubscribe();
        this.logger.info(`x: ${line.x2}, y: ${line.y2}`);
        this.createTile(line.x2, line.y2);
      }
    });
  }

  drawByY(line, params) {
    const length = Math.abs(line.y2 - line.y1);
    const angle = params.dx / params.dy;
    this.logger.info(`x: ${line.x1}, y: ${line.y1}`);
    this.createTile(line.x1, line.y1);
    let x = line.x1 + angle * params.signX;
    let y = line.y1;
    let iterationId = 1;
    while (iterationId < length) {
      y += params.signY;
      this.logger.info(`x: ${Math.floor(x)}, y: ${y}`);
      this.createTile(Math.floor(x), y, 1 - (x % 1));
      this.logger.info(`x: ${Math.floor(x) + 1}, y: ${y}`);
      this.createTile((Math.floor(x) + 1), y, x % 1);
      x += angle * params.signX;
      iterationId++;
    }
    this.logger.info(`x: ${line.x2}, y: ${line.y2}`);
    this.createTile(line.x2, line.y2);
  }

  drawByYDebug(line, params) {
    const length = Math.abs(line.y2 - line.y1);
    const angle = params.dx / params.dy;
    this.logger.info(`x: ${line.x1}, y: ${line.y1}`);
    this.createTile(line.x1, line.y1);
    let x = line.x1 + angle * params.signX;
    let y = line.y1;
    let iterationId = 1;
    const subscription = this.interval.subscribe(() => {
      if (iterationId % 2) {
        y += params.signY;
        this.logger.info(`x: ${Math.floor(x)}, y: ${y}`);
        this.createTile(Math.floor(x), y, 1 - (x % 1));
      } else {
        this.logger.info(`x: ${Math.floor(x) + 1}, y: ${y}`);
        this.createTile((Math.floor(x) + 1), y, x % 1);
        x += angle * params.signX;
      }
      iterationId++;
      if (iterationId > length * 2) {
        subscription.unsubscribe();
        this.logger.info(`x: ${line.x2}, y: ${line.y2}`);
        this.createTile(line.x2, line.y2);
      }
    });
  }


  createTile(xCoord: number, yCoord: number, opacity: number = 1) {
    const context = this.canvas.getContext('2d');
    context.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    console.log(opacity);
    context.fillRect(xCoord * this.tileSize, yCoord * this.tileSize, this.tileSize, this.tileSize);
  }
}
