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

  drawEllipse(x: number, y: number, a: number, debug: boolean = false, b: number) {
    let mX = 0, mY = b, gap = 0, draw = false;
    const aSqr = a * a, bSqr = b * b;
    let delta = aSqr + bSqr - 2 * aSqr * b;
    debug ? this.interval = Observable.interval(1000 /*ms*/).timeInterval() : this.interval = Observable.interval(0 /*ms*/).timeInterval();
    const subscription = this.interval.subscribe(() => {
      draw = false;
      if (mY <= 0) { subscription.unsubscribe(); }
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

  drawHyperbola(x: number, y: number, a: number, debug: boolean = false, b: number) {
    let mY = a, mX = 0, distance = 0, step = 0, draw = false;
    const aSqr = a * a, bSqr = b * b, limit = 50;
    let error = bSqr + 2 * bSqr * a - aSqr;
    debug ? this.interval = Observable.interval(1000 /*ms*/).timeInterval() : this.interval = Observable.interval(0 /*ms*/).timeInterval();
    const subscription = this.interval.subscribe(() => {
      draw = false;
      if (step >= limit) { subscription.unsubscribe(); }
      this.createTile(x + mX, y + mY);
      this.createTile(x + mX, y - mY);
      this.createTile(x - mX, y - mY);
      this.createTile(x - mX, y + mY);
      if (error > 0) {
        distance = 2 * error - bSqr * (2 * mX + 1);
        if (distance > 0) {
          mY++;
          error -= aSqr * (2 * mY + 1);
          draw = true;
        }
      }
      if (error < 0) {
        distance = 2 * error + 2 * mX * bSqr - 1;
        if (distance <= 0) {
          mX++;
          error += bSqr * (2 * mX + 1);
          draw = true;
        }
      }
      if (!draw) {
        mY++;
        mX++;
        error += bSqr * (2 * mX + 1) - aSqr * (2 * mY + 1);
      }
      step++;
    });
  }

  drawParabola(x: number, y: number, a: number, debug: boolean = false) {
    let mY = 0, mX = 0, distance = 0, step = 0;
    const limit = 50;
    let error = 1 - 2 * a;
    debug ? this.interval = Observable.interval(1000 /*ms*/).timeInterval() : this.interval = Observable.interval(0 /*ms*/).timeInterval();
    const subscription = this.interval.subscribe(() => {
      if (step >= limit) { subscription.unsubscribe(); }
      this.createTile(x + mX, y + mY);
      this.createTile(x + mX, y - mY - 1);
      if (error > 0) {
        distance = 2 * (error - mY) - 1;
        mX++;
        if (distance > 0) {
          error -= 2 * a;
        } else {
          mY++;
          error += 2 * mY + 1 - 2 * a;
        }
      } else if (error < 0) {
        distance = 2 * (error + a);
        mY++;
        if (distance <= 0) {
          error += 2 * mY + 1;
        } else {
          mX++;
          error += 2 * mY + 1 - 2 * a;
        }
      } else {
        mY++;
        mX++;
        error += 2 * mY + 1 - 2 * a;
      }
      step++;
    });
  }
}
