import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseCanvasService } from './base-canvas.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class CircleService extends BaseCanvasService {

  constructor(private log: NGXLogger) {
    super(log);
  }

  drawCircle(x: number, y: number, radius: number, debug: boolean = false) {
    let mX = 0, mY = radius, gap = 0, delta = 2 - 2 * radius;
    let draw = false;
    debug ? this.interval = Observable.interval(1000 /*ms*/).timeInterval() : this.interval = Observable.interval(0 /*ms*/).timeInterval();
    const subscription = this.interval.subscribe(() => {
      draw = false;
      if (mY <= 0) { subscription.unsubscribe(); }
      this.createTile(x + mX, y + mY);
      this.createTile(x + mX, y - mY);
      this.createTile(x - mX, y - mY);
      this.createTile(x - mX, y + mY);
      if (delta < 0) {
        gap = 2 * (delta + mY) - 1;
        if (gap <= 0) {
          mX++;
          delta += 2 * mX + 1;
          draw = true;
        }
      }
      if (delta > 0) {
        gap = 2 * (delta - mX) - 1;
        if (gap > 0) {
          mY--;
          delta -= 2 * mY + 1;
          draw = true;
        }
      }
      if (!draw) {
        mX++;
        mY--;
        delta += 2 * ((mX - mY) + 1);
      }
    });
  }

  drawEllipse(x: number, y: number, a: number, b: number, debug: boolean = false) {
    let mX = 0, mY = b, gap = 0, draw = false;
    const aSqr = a * a;
    const bSqr = b * b;
    let delta = aSqr + bSqr - 2 * aSqr * b;
    debug ? this.interval = Observable.interval(1000 /*ms*/).timeInterval() : this.interval = Observable.interval(0 /*ms*/).timeInterval();
    const subscription = this.interval.subscribe(() => {
      draw = false
      if (mY <= 0) { subscription.unsubscribe() }
      this.createTile(x + mX, y + mY);
      this.createTile(x + mX, y - mY);
      this.createTile(x - mX, y - mY);
      this.createTile(x - mX, y + mY);
      if (delta < 0) {
        gap = 2 * (delta + aSqr * mY) - 1;
        if (gap <= 0) {
          mX++;
          delta += bSqr * (2 * mX  + 1);
          draw = true;
        }
      }
      if (delta > 0) {
        gap = 2 * (delta - bSqr * mX) - 1;
        if (gap > 0) {
          mY--;
          delta += aSqr * (1 - 2 * mY);
          draw = true;
        }
      }
      if (!draw) {
        mX++;
        mY--;
        delta += bSqr * (2 * mX + 1) + aSqr * (1 - 2 * mY);
      }
    });
  }
}
