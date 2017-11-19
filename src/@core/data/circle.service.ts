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
    let mX = 0, mY = b;
    const aSqr = a * a;
    const bSqr = b * b;
    let delta = 4 * bSqr * ((mX + 1) * (mX + 1)) + aSqr * ((2 * mX - 1) * (2 * mX - 1)) - 4 * aSqr * bSqr;
    while (aSqr * (2 * mY - 1) > 2 * bSqr * (mX + 1)) {
      this.createTile(x + mX, y + mY);
      this.createTile(x + mX, y - mY);
      this.createTile(x - mX, y - mY);
      this.createTile(x - mX, y + mY);
      if (delta < 0) {
        mX++;
        delta += 4 * bSqr * (2 * mX + 3);
      } else {
        mX++;
        delta -= 8 * aSqr * (mY - 1) + 4 * bSqr * (2 * mX + 3);
        mY--;
      }
    }
    delta = bSqr * ((2 * mX + 1) * (2 * mX + 1)) + 4 * aSqr * ((mY + 1) * (mY + 1)) - 4 * aSqr * bSqr;
    while (mY + 1 !== 0) {
      this.createTile(x + mX, y + mY);
      this.createTile(x + mX, y - mY);
      this.createTile(x - mX, y - mY);
      this.createTile(x - mX, y + mY);
      if (delta < 0) {
        mY--;
        delta += 4 * aSqr * (2 * mY + 3);
      } else {
        mY--;
        delta -= 8 * bSqr * (mX + 1) + 4 * aSqr * (2 * mY + 3);
        mX++;
      }
    }
  }
}
