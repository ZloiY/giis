import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Lab2Component } from './lab-2/lab-2.component';
import { Lab1Component } from './lab-1/lab-1.component';

export const routes: Routes = [
  { path: '', redirectTo: '/lab-1', pathMatch: 'full' },
  { path: 'lab-1', component: Lab1Component },
  { path: 'lab-2', component: Lab2Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
