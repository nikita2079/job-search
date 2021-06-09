import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JobsAppliedPage } from './jobs-applied.page';

const routes: Routes = [
  {
    path: '',
    component: JobsAppliedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JobsAppliedPage],
  entryComponents: []
})
export class JobsAppliedPageModule {}
