import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordModallPage } from './reset-password-modall.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordModallPage
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
  exports: [ResetPasswordModallPage],
  declarations: [ResetPasswordModallPage]
})
export class ResetPasswordModallPageModule {}
