import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Lab1Component } from './lab-1/lab-1.component';
import { Lab1Service } from './lab-1/lab-1.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

@NgModule({
  declarations: [
    AppComponent,
    Lab1Component
  ],
  imports: [
    BrowserModule,
    LoggerModule.forRoot({level: NgxLoggerLevel.INFO, serverLogLevel: NgxLoggerLevel.DEBUG}),
  ],
  providers: [Lab1Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
