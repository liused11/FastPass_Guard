import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GuardQrPageRoutingModule } from './guard-qr-routing.module';
import { GuardQrPage } from './guard-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuardQrPageRoutingModule
  ],
  declarations: [GuardQrPage]
})
export class GuardQrPageModule {}
