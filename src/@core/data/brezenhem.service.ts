import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/timeInterval';

import { Line } from '../line.model';
import { BaseCanvasService } from './base-canvas.service';

@Injectable()
export class BrezenhemService extends BaseCanvasService {

  constructor(private log: NGXLogger) {
    super(log);
  }

  drawBrezenhemLine(line: Line,  debug: boolean = false) {
    const brenzehemParams = {
      length: Math.max(Math.abs(line.x2 - line.x1), Math.abs(line.y2 - line.y1)),
      dx: Math.abs(line.x2 - line.x1),
      dy: Math.abs(line.y2 - line.y1),
      signX: Math.sign(line.x2 - line.x1),
      signY: Math.sign(line.y2 - line.y1),
      x: line.x1,
      y: line.y1,
    };
    this.logger.info('Start drawing...');
    this.logger.info(`x:${brenzehemParams.x}, y:${brenzehemParams.y}`);
    this.createTile(brenzehemParams.x, brenzehemParams.y);
    brenzehemParams.dx > brenzehemParams.dy ? this.drawByX(brenzehemParams, debug) : this.drawByY(brenzehemParams, debug);
  }

  protected drawByX(params, debug) {
    let iterationId = 0;
    let e = 2 * params.dy - params.dx;
    if (debug) {
      const subscription = this.interval.subscribe(() => {
        if (e >= 0) {
          params.y += params.signY;
          e -= 2 * params.dx;
        }
        params.x += params.signX;
        e += 2 * params.dy;
        iterationId++;
        this.logger.info(`x:${params.x}, y:${params.y}`);
        this.createTile(params.x, params.y);
        if (iterationId >= params.length) {
          subscription.unsubscribe();
          this.logger.info('End drawing.');
        }
      });
    } else {
      while (iterationId < params.length) {
        if (e >= 0) {
          params.y += params.signY;
          e -= 2 * params.dx;
        }
        params.x += params.signX;
        e += 2 * params.dy;
        iterationId++;
        this.logger.info(`x:${params.x}, y:${params.y}`);
        this.createTile(params.x, params.y);
      }
      this.logger.info('End drawing.');
    }
  }

  protected drawByY(params, debug) {
    let iterationId = 0;
    let e = 2 * params.dx - params.dy;
    if (debug) {
      const subscription = this.interval.subscribe(() => {
        if (e >= 0) {
          params.x += params.signX;
          e -= 2 * params.dy;
        }
        params.y += params.signY;
        e += 2 * params.dx;
        iterationId++;
        this.logger.info(`x:${params.x}, y:${params.y}`);
        this.createTile(params.x, params.y);
        if (iterationId >= params.length) {
          subscription.unsubscribe();
          this.logger.info('End drawing.');
        }
      });
    } else {
      while (iterationId < params.length) {
        if (e >= 0) {
          params.x += params.signX;
          e -= 2 * params.dy;
        }
        params.y += params.signY;
        e += 2 * params.dx;
        iterationId++;
        this.logger.info(`x:${params.x}, y:${params.y}`);
        this.createTile(params.x, params.y);
      }
      this.logger.info('End drawing.');
    }
  }
}
