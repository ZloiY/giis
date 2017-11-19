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
  }

  ngOnDestroy() {
    this.debounce.unsubscribe();
  }

  setLine(debug) {
    // this.circleService.drawCircle(Number(this.x1Coord), Number(this.y1Coord), Number(this.x2Coord), debug);
    this.circleService.drawEllipse(Number(this.x1Coord), Number(this.y1Coord), Number(this.x2Coord), Number(this.y2Coord));
  }

  removeLines() {
    this.circleService.drawGrid();
  }

}
