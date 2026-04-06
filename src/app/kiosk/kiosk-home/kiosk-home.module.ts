import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { KioskHomePage } from './kiosk-home.page';

const routes: Routes = [
  { path: '', component: KioskHomePage },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), KioskHomePage],
})
export class KioskHomePageModule {}
