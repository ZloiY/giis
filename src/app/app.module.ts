import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Lab1Component } from './lab-1/lab-1.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { DataModule } from '../@core/data/data.module';
import { Lab2Component } from './lab-2/lab-2.component';
import {AppRoutingModule} from "./app-routing.module";
import {CommonModule} from "@angular/common";
import { Lab3Component } from './lab-3/lab-3.component';

@NgModule({
  declarations: [
    AppComponent,
    Lab1Component,
    Lab2Component,
    Lab3Component
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    DataModule,
    LoggerModule.forRoot({level: NgxLoggerLevel.INFO, serverLogLevel: NgxLoggerLevel.DEBUG}),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
