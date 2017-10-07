import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Lab1Component } from './lab-1/lab-1.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { DataModule } from '../@core/data/data.module';

@NgModule({
  declarations: [
    AppComponent,
    Lab1Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DataModule,
    LoggerModule.forRoot({level: NgxLoggerLevel.INFO, serverLogLevel: NgxLoggerLevel.DEBUG}),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
