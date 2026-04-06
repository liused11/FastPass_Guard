import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { KioskLayoutComponent } from './kiosk-layout/kiosk-layout.component';

const routes: Routes = [
  {
    path: 'station-select',
    loadChildren: () => import('./station-select/station-select.module').then(m => m.StationSelectPageModule)
  },
  {
    path: 'kiosk',
    component: KioskLayoutComponent,
    children: [
      {
        path: 'welcome',
        loadChildren: () =>
          import('./kiosk-welcome/kiosk-welcome.module').then(
            (m) => m.KioskWelcomePageModule
          ),
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./kiosk-home/kiosk-home.module').then(
            (m) => m.KioskHomePageModule
          ),
      },
      {
        path: 'scan-qr',
        loadChildren: () =>
          import('./kiosk-scan-qr/kiosk-scan-qr.module').then(
            (m) => m.KioskScanQrPageModule
          ),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./kiosk-register/kiosk-register.module').then(
            (m) => m.KioskRegisterPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '**',
    redirectTo: '/station-select',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
