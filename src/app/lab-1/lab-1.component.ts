import { Component, OnInit } from '@angular/core';
import { CanvasService } from '../../@core/data/canvas.service';

@Component({
  selector: 'app-lab-1',
  templateUrl: './lab-1.component.html',
  styleUrls: ['./lab-1.component.scss']
})
export class Lab1Component {

  canvasHeight = 600;
  canvasWidth = 800;

  constructor(private lab1Service: CanvasService) {  }

  setGrid(canvas, tileSize: number) {
    this.lab1Service.drawGrid(canvas, tileSize);
  }

  setLine(canvas, x1: number, y1: number, x2: number, y2: number, tileSize: number, debugCheck: boolean) {
    const intTileSize: number = Number(tileSize);
    const intX1: number = Number(x1);
    const intX2: number = Number(x2);
    const intY1: number = Number(y1);
    const intY2: number = Number(y2);
    const line = {
      x1: intX1,
      y1: intY1,
      x2: intX2,
      y2: intY2
    };
   this.lab1Service.drawLine(canvas, line, intTileSize, debugCheck) ;
  }
}
