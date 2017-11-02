import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineService } from './line.service';

@NgModule({
  imports: [CommonModule],
  providers: [LineService],
})
export class DataModule {}
