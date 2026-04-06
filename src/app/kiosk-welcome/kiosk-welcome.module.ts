import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { KioskWelcomePage } from './kiosk-welcome.page';

const routes: Routes = [
  { path: '', component: KioskWelcomePage },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), KioskWelcomePage],
})
export class KioskWelcomePageModule {}
