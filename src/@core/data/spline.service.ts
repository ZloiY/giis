import { Injectable } from '@angular/core';

import { Matrix, solve } from 'ml-matrix';

import { NGXLogger } from 'ngx-logger';

import { TileModel } from '../tile.model';
import { BaseCanvasService } from './base-canvas.service';
import { BrezenhemService } from './brezenhem.service';
import { Line } from '../line.model';

@Injectable()
export class SplineService extends BaseCanvasService {

  constructor (
    private log: NGXLogger,
    private brezenhemLine: BrezenhemService,
    ) {
    super(log);
  }

  private HERMITE_MATRIX = new Matrix([
    [2, -2, 1, 1],
    [-3, 3, -2, -1],
    [0, 0, 1, 0],
    [1, 0, 0, 0]
  ]);
  private BEZIRE_MATRIX = new Matrix([
    [-1, 3, -3, 1],
    [3, -6, 3, 0],
    [-3, 3, 0, 0],
    [1, 0, 0, 0]
  ]);
  private  B_SPLINE_MATRIX = new Matrix([
    [-1, 3, -3, 1],
    [3, -6, 3, 0],
    [-3, 0, 3, 0],
    [1, 4, 1, 0],
  ]);
  private _tStep = 0.1;

  get tStep(): number {
    return this._tStep;
  }

  set tStep(value: number) {
    this._tStep = value;
  }

  drawHermite(p1: TileModel, p4: TileModel, r1: TileModel, r4: TileModel) {
    const valueMatrix = new Matrix([
      [Number(p1.x), Number(p1.y)],
      [Number(p4.x), Number(p4.y)],
      [Number(r1.x), Number(r1.y)],
      [Number(r4.x), Number(r4.y)]
    ]);
    const valueHermiteMatrix = this.HERMITE_MATRIX.mmul(valueMatrix);
    this.prepareBrezenhem();
    this.drawSpline(this.genT(valueHermiteMatrix));
  }

  drawBezire(p1: TileModel, p2: TileModel, p3: TileModel, p4: TileModel) {
    const valueMatrix = new Matrix([
      [Number(p1.x), Number(p1.y)],
      [Number(p2.x), Number(p2.y)],
      [Number(p3.x), Number(p3.y)],
      [Number(p4.x), Number(p4.y)]
    ]);
    const valueBezireMatrix = this.BEZIRE_MATRIX.mmul(valueMatrix);
    this.prepareBrezenhem();
    this.drawSpline(this.genT(valueBezireMatrix));
  }

  drawBSpline(tiles: TileModel[]) {
    for (let tileId = 0; tileId < tiles.length - 3; tileId++) {
      const p1 = tiles[tileId];
      const p2 = tiles[tileId + 1];
      const p3 = tiles[tileId + 2];
      const p4 = tiles[tileId + 3];
      const valueMatrix = new Matrix([
        [Number(p1.x), Number(p1.y)],
        [Number(p2.x), Number(p2.y)],
        [Number(p3.x), Number(p3.y)],
        [Number(p4.x), Number(p4.y)]
      ]);
      const valueBSplineMatrix = this.B_SPLINE_MATRIX.mmul(valueMatrix);
      this.prepareBrezenhem();
      this.drawSpline(this.genTBSpline(valueBSplineMatrix));
    }
  }

  protected genT(valueMatrix): TileModel[] {
    const limit = Math.floor(1 / this._tStep);
    const tileArray = [];
    for (let tIncrementor = 0; tIncrementor <= limit; tIncrementor++) {
      const matrix = this.getTMatrix(tIncrementor * this._tStep);
      const resultMatrix = matrix.mmul(valueMatrix);
      tileArray.push(new TileModel(resultMatrix.get(0, 0) + 0.5, resultMatrix.get(0, 1) + 0.5));
    }
    return tileArray;
  }

  protected genTBSpline(valueMatrix): TileModel[] {
    const limit = Math.floor(1 / this._tStep);
    const tileArray = [];
    for (let tIncrementor = 0; tIncrementor <= limit; tIncrementor++) {
      const matrix = this.getTMatrix(tIncrementor * this._tStep);
      const resultMatrix = Matrix.div(matrix.mmul(valueMatrix), 6);
      tileArray.push(new TileModel(resultMatrix.get(0, 0) + 0.5, resultMatrix.get(0, 1) + 0.5));
    }
    return tileArray;
  }

  protected prepareBrezenhem() {
    this.brezenhemLine.setCanvas(this.canvas);
    this.brezenhemLine.setTileSize(this.tileSize);
  }

  protected getTMatrix(t: number) {
    return new Matrix([[Math.pow(t, 3), Math.pow(t, 2), t, 1]]);
  }

  protected drawSpline(tiles: TileModel[]) {
    for (let tileId = 0; tileId < tiles.length - 1; tileId++) {
      const line = new Line(
        Math.floor(tiles[tileId].x),
        Math.floor(tiles[tileId + 1].x),
        Math.floor(tiles[tileId].y),
        Math.floor(tiles[tileId + 1].y),
      );
      this.brezenhemLine.drawBrezenhemLine(line);
    }
  }
}
