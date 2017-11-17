import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/timeInterval';

import { BaseCanvasService } from './base-canvas.service';
import { Line } from '../line.model';

@Injectable()
export class WuService extends BaseCanvasService {

  constructor (private log: NGXLogger) {
    super(log);
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
    this.logger.info('Start drawing...');
    if (dx === 0 || dy === 0 || dx === dy) {
      this.drawLine(line, debug);
      return;
    }
    if (dy < dx) {
      debug ? this.drawByXDebug(line, params) : this.drawByX(line, params);
    } else {
      debug ? this.drawByYDebug(line, params) : this.drawByY(line, params);
    }
    this.logger.info('End drawing.');
  }

  protected drawByX(line, params) {
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

  protected drawByXDebug(line, params) {
    const length = Math.abs(line.x2 - line.x1);
    const angle = params.dy / params.dx;
    this.logger.info(`x: ${line.x1}, y: ${line.y1}`);
    this.createTile(line.x1, line.y1);
    let iterationId = 1;
    let x = line.x1;
    let y = line.y1 + angle * params.signY;
    const subscription = this.interval.subscribe(() => {
      x += params.signX;
      this.logger.info(`x: ${x}, y: ${Math.floor(y)}`);
      this.createTile(x, Math.floor(y), 1 - (y % 1));
      this.logger.info(`x: ${x}, y: ${Math.floor(y) + 1}`);
      this.createTile(x, (Math.floor(y) + 1), y % 1);
      y += angle * params.signY;
      iterationId++;
      if (iterationId > length) {
        subscription.unsubscribe();
        this.logger.info(`x: ${line.x2}, y: ${line.y2}`);
        this.createTile(line.x2, line.y2);
      }
    });
  }

  protected drawByY(line, params) {
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

  protected drawByYDebug(line, params) {
    const length = Math.abs(line.y2 - line.y1);
    const angle = params.dx / params.dy;
    this.logger.info(`x: ${line.x1}, y: ${line.y1}`);
    this.createTile(line.x1, line.y1);
    let x = line.x1 + angle * params.signX;
    let y = line.y1;
    let iterationId = 1;
    const subscription = this.interval.subscribe(() => {
      y += params.signY;
      this.logger.info(`x: ${Math.floor(x)}, y: ${y}`);
      this.createTile(Math.floor(x), y, 1 - (x % 1));
      this.logger.info(`x: ${Math.floor(x) + 1}, y: ${y}`);
      this.createTile((Math.floor(x) + 1), y, x % 1);
      x += angle * params.signX;
      iterationId++;
      if (iterationId > length) {
        subscription.unsubscribe();
        this.logger.info(`x: ${line.x2}, y: ${line.y2}`);
        this.createTile(line.x2, line.y2);
      }
    });
  }

  protected drawLine(line, debug) {
    if (line.x2 - line.x1 === 0) {
      let iterationId = 0;
      let y = line.y1;
      debug ? this.interval = Observable.interval(1000).timeInterval() : this.interval = Observable.interval(1).timeInterval();
      const subscription = this.interval.subscribe(() => {
        this.createTile(line.x1, y);
        y++;
        iterationId++;
        if (iterationId >= line.y2 - line.y1) {
          subscription.unsubscribe();
        }
      });
    }
    if (line.y2 - line.y1 === 0) {
      let iterationId = 0;
      let x = line.x1;
      debug ? this.interval = Observable.interval(1000).timeInterval() : this.interval = Observable.interval(1).timeInterval();
      const subscription = this.interval.subscribe(() => {
        this.createTile(x, line.y1);
        x++;
        iterationId++;
        if (iterationId >= line.x2 - line.x1) {
          subscription.unsubscribe();
        }
      });
    }
    if (line.y2 - line.y1 === line.x2 - line.x1) {
      let iterationId = 0;
      let x = line.x1;
      let y = line.y1;
      debug ? this.interval = Observable.interval(1000).timeInterval() : this.interval = Observable.interval(1).timeInterval();
      const subscription = this.interval.subscribe(() => {
        this.createTile(x, y);
        x++;
        y++;
        iterationId++;
        if (iterationId >= line.x2 - line.x1) {
          subscription.unsubscribe();
        }
      });
    }
  }
}
