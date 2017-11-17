import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/throttle';

import { LineService } from '../../@core/data/line.service';
import { Line } from '../../@core/line.model';
import { BrezenhemService } from '../../@core/data/brezenhem.service';
import { WuService } from '../../@core/data/wu.service';

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
    ddaMode: function (line, debugCheck) {
      this.lineService.drawLine(line, debugCheck);
    },
    brezenhemMode: function (line, debugCheck) {
      this.brezenhemService.setCanvas(this.canvasRef.nativeElement);
      this.brezenhemService.setTileSize(this.tileSize);
      this.brezenhemService.drawBrezenhemLine(line, debugCheck);
    },
    vuMode: function (line, debugCheck) {
      this.wuService.setCanvas(this.canvasRef.nativeElement);
      this.wuService.setTileSize(this.tileSize);
      this.wuService.drawVuLine(line, debugCheck);
    }
  };

  constructor(private lineService: LineService,
              private brezenhemService: BrezenhemService,
              private wuService: WuService) { }

  ngOnInit() {
    this.currentMode = this.drawingMode.ddaMode;
    this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasRef.nativeElement.height = window.innerHeight;
    const drawGrid = Observable.interval(50)
      .subscribe(val => {
        this.lineService.setCanvas(this.canvasRef.nativeElement);
        this.lineService.setTileSize(this.tileSize);
        this.lineService.drawGrid();
        drawGrid.unsubscribe();
      });
    this.debounce = Observable.fromEvent(this.inputRef.nativeElement, 'input')
      .debounceTime(1000)
      .map(() => {
        if (this.tileSize === 0 || this.tileSize < 5) {
          this.tileSize = 10;
        }
        this.lineService.setTileSize(this.tileSize);
      })
      .subscribe(val => this.lineService.drawGrid());
  }

  ngOnDestroy() {
    this.debounce.unsubscribe();
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
      case '3': {
        this.currentMode = this.drawingMode.vuMode;
      }
    }
  }

  setLine(debugCheck: boolean) {
    const intX1: number = Number(this.x1Coord);
    const intX2: number = Number(this.x2Coord);
    const intY1: number = Number(this.y1Coord);
    const intY2: number = Number(this.y2Coord);
    const line = new Line(intX1, intX2, intY1, intY2);
    this.currentMode(line, debugCheck);
  }

  removeLines() {
    this.lineService.drawGrid();
  }
}
