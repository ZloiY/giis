export class TileModel {

  constructor(canvas, xAxis: number, yAxis: number, tileSize: number) {
    const context = canvas.getContext('2d');
    canvas.fillRect(xAxis, yAxis, tileSize, tileSize);
  }
}
