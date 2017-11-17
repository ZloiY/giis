import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/observable/interval';

import { Line } from '../line.model';
import { BaseCanvasService } from './base-canvas.service';

@Injectable()
export class LineService extends BaseCanvasService {

  constructor(private log: NGXLogger) {
    super(log);
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
}
