import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  // Gate Status
  gateStatus: 'Open' | 'Closed' | 'Moving' = 'Closed';
  vehicleType: string = 'car';

  constructor() {}

  openGate() {
    if (this.gateStatus === 'Moving') return;
    this.gateStatus = 'Moving';
    setTimeout(() => {
      this.gateStatus = 'Open';
    }, 2000);
  }

  closeGate() {
    if (this.gateStatus === 'Moving') return;
    this.gateStatus = 'Moving';
    setTimeout(() => {
      this.gateStatus = 'Closed';
    }, 2000);
  }

  emergencyOpen() {
    this.gateStatus = 'Open';
  }
}
