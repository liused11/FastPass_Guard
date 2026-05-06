import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { KioskRoutingModule } from './kiosk-routing.module';
import { KioskLayoutComponent } from './kiosk-layout/kiosk-layout.component';

@NgModule({
  imports: [CommonModule, IonicModule, KioskRoutingModule, KioskLayoutComponent],
})
export class KioskModule {}
