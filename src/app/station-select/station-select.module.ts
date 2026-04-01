import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { StationSelectPage } from './station-select.page';

const routes: Routes = [
  { path: '', component: StationSelectPage }
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [StationSelectPage]
})
export class StationSelectPageModule {}
