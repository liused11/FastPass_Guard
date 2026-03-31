import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  // Lookup
  licensePlateStr: string = '';
  searchResult: any = null;

  // Logs
  logs: any[] = [
    { plate: 'ABC-1234', time: new Date(Date.now() - 1000*60*5), status: 'Check-in' },
    { plate: 'XYZ-9876', time: new Date(Date.now() - 1000*60*15), status: 'Check-out' },
    { plate: 'MOTO-55', time: new Date(Date.now() - 1000*60*30), status: 'Check-in' },
  ];

  constructor() {}

  scanQR() {
    console.log('Scanning QR Code...');
    // Placeholder logic
  }

  searchPlate() {
    if (!this.licensePlateStr) return;
    // Mock search
    this.searchResult = {
      plate: this.licensePlateStr,
      model: 'Toyota Camry',
      bookingStatus: 'Confirmed',
      userName: 'John Doe',
      role: 'Visitor'
    };
  }

  confirmCheckIn() {
    if (!this.searchResult) return;
    this.logs.unshift({
      plate: this.searchResult.plate,
      time: new Date(),
      status: 'Check-in'
    });
    // keep only last 5
    if (this.logs.length > 5) this.logs.pop();
    this.searchResult = null;
    this.licensePlateStr = '';
  }

  confirmCheckOut() {
    if (!this.searchResult) return;
    this.logs.unshift({
      plate: this.searchResult.plate,
      time: new Date(),
      status: 'Check-out'
    });
    // keep only last 5
    if (this.logs.length > 5) this.logs.pop();
    this.searchResult = null;
    this.licensePlateStr = '';
  }
}
