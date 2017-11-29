import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { TileModel } from '../../@core/tile.model';
import { SplineService } from '../../@core/data/spline.service';

@Component({
  selector: 'app-lab-3',
  templateUrl: './lab-3.component.html',
  styleUrls: ['./lab-3.component.scss']
})
export class Lab3Component implements OnInit, OnDestroy {

  @ViewChild('canvas')canvasRef: ElementRef;
  @ViewChild('inputTileSize')inputRef: ElementRef;
  tileSize = 15;
  p1 = new TileModel();
  p4 = new TileModel();
  r1 = new TileModel();
  r4 = new TileModel();
  bSplineTiles = [
    this.p1,
    this.p4,
    this.r1,
    this.r4,
  ];
  currentMode: any;
  debounce: any;
  drawingMode = {
    hermiteMode: function (p1, p4, r1, r4) {
      this.splineService.drawHermite(p1, p4, r1, r4);
    },
    bezireMode: function (p1, p2, p3, p4) {
      this.splineService.drawBezire(p1, p2, p3, p4);
    },
    bSplineMode: function (tiles: TileModel[]) {
      this.splineService.drawBSpline(tiles);
    }
  };

  constructor(
    private splineService: SplineService,
  ) { }

  ngOnInit() {
    this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasRef.nativeElement.height = window.innerHeight;
    this.currentMode = this.drawingMode.hermiteMode;
    const drawGrid = Observable.interval(50)
      .subscribe(val => {
        this.splineService.setCanvas(this.canvasRef.nativeElement);
        this.splineService.setTileSize(this.tileSize);
        this.splineService.drawGrid();
        drawGrid.unsubscribe();
      });
    this.debounce = Observable.fromEvent(this.inputRef.nativeElement, 'input')
      .debounceTime(1000)
      .map(() => {
        if (this.tileSize === 0 || this.tileSize < 5) {
          this.tileSize = 10;
        }
        this.splineService.setTileSize(this.tileSize);
      })
      .subscribe(val => this.splineService.drawGrid());
  }

  ngOnDestroy() {
    this.debounce.unsubscribe();
  }

  setLine(point1: TileModel, point2: TileModel, point3: TileModel, point4: TileModel) {
    this.currentMode(point1, point2, point3, point4);
  }

  setBSpline() {
    this.splineService.drawBSpline(this.bSplineTiles);
  }

  chooseDrawingMode(value) {
    switch (value) {
      case '1': {
        this.currentMode = this.drawingMode.hermiteMode;
        break;
      }
      case '2': {
        this.currentMode = this.drawingMode.bezireMode;
        break;
      }
      case '3': {
        this.currentMode = this.drawingMode.bSplineMode;
        break;
      }
    }
  }

  addBSplineTile() {
    this.bSplineTiles.push(new TileModel());
  }

  removeLines() {
    this.splineService.drawGrid();
  }
}
