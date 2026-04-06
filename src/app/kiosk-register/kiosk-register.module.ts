import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { KioskRegisterPage } from './kiosk-register.page';

const routes: Routes = [
  { path: '', component: KioskRegisterPage },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), KioskRegisterPage],
})
export class KioskRegisterPageModule {}
