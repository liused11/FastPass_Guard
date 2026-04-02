import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardQrPage } from './guard-qr.page';

const routes: Routes = [
  { path: '', component: GuardQrPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuardQrPageRoutingModule {}
