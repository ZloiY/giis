import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LineService } from './line.service';
import { BrezenhemService } from './brezenhem.service';
import { WuService } from './wu.service';

@NgModule({
  imports: [CommonModule],
  providers: [LineService, BrezenhemService, WuService],
})
export class DataModule {}
