import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineService } from './line.service';
import { BrezenhemService } from './brezenhem.service';
import { WuService } from './wu.service';
import { BaseCanvasService } from './base-canvas.service';
import { CircleService } from './circle.service';

@NgModule({
  imports: [CommonModule],
  providers: [LineService, BrezenhemService, BaseCanvasService, WuService, CircleService],
})
export class DataModule {}
