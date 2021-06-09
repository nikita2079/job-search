import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JobBookmarksPage } from './job-bookmarks.page';

const routes: Routes = [
  {
    path: '',
    component: JobBookmarksPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JobBookmarksPage],
  entryComponents: []
})
export class JobBookmarksPageModule {}
