import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { CircleService } from '../../@core/data/circle.service';

@Component({
  selector: 'app-lab-2',
  templateUrl: './lab-2.component.html',
  styleUrls: ['./lab-2.component.scss']
})
export class Lab2Component implements OnInit, OnDestroy {

  @ViewChild('canvas')canvasRef: ElementRef;
  @ViewChild('inputTileSize')inputRef: ElementRef;
  tileSize = 15;
  x1Coord = 0;
  x2Coord = 0;
  y1Coord = 0;
  y2Coord = 0;
  debounce = null;
  currentMode = null;
  drawingMode = {
    circleMode: function (x, y, radius, debugCheck) {
      this.circleService.drawCircle(x, y, radius, debugCheck);
    },
    ellipsMode: function (x, y, a, debugCheck, b) {
      this.circleService.drawEllipse(x, y, a, debugCheck, b);
    },
    hyperbolaMode: function (x, y, a, debugCheck, b) {
      this.circleService.drawHyperbola(x, y, a, debugCheck, b);
    },
    parabolaMode: function (x, y, a, debugCheck) {
      this.circleService.drawParabola(x, y, a, debugCheck);
    }
  };

  constructor(private circleService: CircleService) { }

  ngOnInit() {
    this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasRef.nativeElement.height = window.innerHeight;
    const drawGrid = Observable.interval(50)
      .subscribe(val => {
        this.circleService.setCanvas(this.canvasRef.nativeElement);
        this.circleService.setTileSize(this.tileSize);
        this.circleService.drawGrid();
        drawGrid.unsubscribe();
      });
    this.debounce = Observable.fromEvent(this.inputRef.nativeElement, 'input')
      .debounceTime(1000)
      .map(() => {
        if (this.tileSize === 0 || this.tileSize < 5) {
          this.tileSize = 10;
        }
        this.circleService.setTileSize(this.tileSize);
      })
      .subscribe(val => this.circleService.drawGrid());
    this.currentMode = this.drawingMode.circleMode;
  }

  ngOnDestroy() {
    this.debounce.unsubscribe();
  }

  chooseDrawingMode(value) {
    switch (value) {
      case '1': {
        this.currentMode = this.drawingMode.circleMode;
        break;
      }
      case '2': {
        this.currentMode = this.drawingMode.ellipsMode;
        break;
      }
      case '3': {
        this.currentMode = this.drawingMode.hyperbolaMode;
        break;
      }
      case '4': {
        this.currentMode = this.drawingMode.parabolaMode;
        break;
      }
    }
  }

  setLine(x: number, y: number, a: number, debug: boolean = false, b?: number) {
    this.currentMode(Number(x), Number(y), Number(a), debug, Number(b));
  }

  removeLines() {
    this.circleService.drawGrid();
  }

}
