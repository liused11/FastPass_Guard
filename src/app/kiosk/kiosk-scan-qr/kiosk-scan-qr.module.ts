import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { KioskScanQrPage } from './kiosk-scan-qr.page';

const routes: Routes = [
  { path: '', component: KioskScanQrPage },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), KioskScanQrPage],
})
export class KioskScanQrPageModule {}
