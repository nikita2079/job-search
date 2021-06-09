import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VerifyModalPage } from './verify-modal.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [VerifyModalPage],
  declarations: [VerifyModalPage]
})
export class VerifyModalPageModule {}
