import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DoorAccessPage } from './door-access.page';

const routes: Routes = [
  { path: '', component: DoorAccessPage }
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [DoorAccessPage]
})
export class DoorAccessPageModule {}
