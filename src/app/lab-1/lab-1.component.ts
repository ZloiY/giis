import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/throttle';

import { CanvasService } from '../../@core/data/canvas.service';
import { Line } from '../../@core/line.model';

@Component({
  selector: 'app-lab-1',
  templateUrl: './lab-1.component.html',
  styleUrls: ['./lab-1.component.scss']
})
export class Lab1Component implements OnInit, OnDestroy {

  @ViewChild('canvas')canvasRef: ElementRef;
  @ViewChild('inputTileSize')inputRef: ElementRef;
  tileSize = 15;
  x1Coord = 0;
  x2Coord = 0;
  y1Coord = 0;
  y2Coord = 0;
  debounce: any;
  currentMode: any;
  drawingMode = {
    ddaMode: function (canvas, line, intTileSize, debugCheck) {
      this.canvasService.drawLine(canvas, line, intTileSize, debugCheck);
    },
    brezenhemMode: function (canvas, line, intTileSize, debugCheck) {
      this.canvasService.drawBrezenhemLine(canvas, line, intTileSize, debugCheck);
    },
  };

  constructor(private canvasService: CanvasService) { }

  ngOnInit() {
    this.currentMode = this.drawingMode.ddaMode;
    this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasRef.nativeElement.height = window.innerHeight;
    const drawGrid = Observable.interval(50)
      .subscribe(val => {
        this.canvasService.drawGrid(this.canvasRef.nativeElement, this.tileSize);
        drawGrid.unsubscribe();
      });
    this.debounce = Observable.fromEvent(this.inputRef.nativeElement, 'input')
      .debounceTime(1000)
      .map(() => {
        if (this.tileSize === 0 || this.tileSize < 5) {
          this.tileSize = 10;
        }
      })
      .subscribe(val => this.canvasService.drawGrid(this.canvasRef.nativeElement, this.tileSize));
  }

  chooseDebug(value) {
    switch (value) {
      case '1': {
        this.currentMode = this.drawingMode.ddaMode;
        break;
      }
      case '2': {
        this.currentMode = this.drawingMode.brezenhemMode;
        break;
      }
    }
  }

  ngOnDestroy() {
    this.debounce.unsubscribe();
  }

  setLine(debugCheck: boolean) {
    const intTileSize: number = Number(this.tileSize);
    const intX1: number = Number(this.x1Coord);
    const intX2: number = Number(this.x2Coord);
    const intY1: number = Number(this.y1Coord);
    const intY2: number = Number(this.y2Coord);
    const line = new Line(intX1, intX2, intY1, intY2);
    this.currentMode(this.canvasRef.nativeElement, line, intTileSize, debugCheck);
  }

  removeLines() {
    this.canvasService.drawGrid(this.canvasRef.nativeElement, this.tileSize);
  }
}
