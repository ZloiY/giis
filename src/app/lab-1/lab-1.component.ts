import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/throttle';

import { CanvasService } from '../../@core/data/canvas.service';

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

  constructor(private canvasService: CanvasService) { }

  ngOnInit() {
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

  ngOnDestroy() {
    this.debounce.unsubscribe();
  }

  setLine(debugCheck: boolean) {
    const intTileSize: number = Number(this.tileSize);
    const intX1: number = Number(this.x1Coord);
    const intX2: number = Number(this.x2Coord);
    const intY1: number = Number(this.y1Coord);
    const intY2: number = Number(this.y2Coord);
    const line = {
      x1: intX1,
      y1: intY1,
      x2: intX2,
      y2: intY2
    };
   this.canvasService.drawLine(this.canvasRef.nativeElement, line, intTileSize, debugCheck) ;
  }
}
