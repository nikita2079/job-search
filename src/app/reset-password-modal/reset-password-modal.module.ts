import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordModalPage } from './reset-password-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordModalPage
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
  exports: [ResetPasswordModalPage],
  declarations: [ResetPasswordModalPage]
})
export class ResetPasswordModalPageModule {}
