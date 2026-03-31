import { Component } from '@angular/core';

interface LogEntry {
  plate: string;
  time: Date;
  status: 'Check-in' | 'Check-out';
  building: string;
  floor: string;
  slot: string;
  gate: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  licensePlateStr: string = '';
  searchResult: any = null;

  logs: LogEntry[] = [
    { plate: 'กข-1234', time: new Date(Date.now() - 1000*60*5),  status: 'Check-in',  building: 'อาคาร FIBO', floor: 'ชั้น 3', slot: 'B14', gate: 'Gate A' },
    { plate: 'ขค-5678', time: new Date(Date.now() - 1000*60*22), status: 'Check-out', building: 'อาคาร FIBO', floor: 'ชั้น 2', slot: 'A07', gate: 'Gate A' },
    { plate: 'คง-9999', time: new Date(Date.now() - 1000*60*41), status: 'Check-in',  building: 'อาคาร FIBO', floor: 'ชั้น 1', slot: 'C02', gate: 'Gate B' },
    { plate: 'งจ-3344', time: new Date(Date.now() - 1000*60*58), status: 'Check-out', building: 'อาคาร 9',   floor: 'ชั้น 4', slot: 'D19', gate: 'Gate A' },
  ];

  constructor() {}

  scanQR() {
    console.log('Scanning QR…');
  }

  searchPlate() {
    if (!this.licensePlateStr.trim()) return;
    this.searchResult = {
      plate: this.licensePlateStr.trim().toUpperCase(),
      model: 'Toyota Camry (2023)',
      bookingStatus: 'Confirmed',
      userName: 'สมชาย ใจดี',
      role: 'Visitor',
      building: 'อาคาร FIBO',
      floor: 'ชั้น 3',
      slot: 'B14',
      gate: 'Gate A',
    };
  }

  confirmCheckIn() {
    if (!this.searchResult) return;
    this.logs.unshift({
      plate: this.searchResult.plate,
      time: new Date(),
      status: 'Check-in',
      building: this.searchResult.building,
      floor: this.searchResult.floor,
      slot: this.searchResult.slot,
      gate: this.searchResult.gate,
    });
    if (this.logs.length > 5) this.logs.pop();
    this.searchResult = null;
    this.licensePlateStr = '';
  }

  confirmCheckOut() {
    if (!this.searchResult) return;
    this.logs.unshift({
      plate: this.searchResult.plate,
      time: new Date(),
      status: 'Check-out',
      building: this.searchResult.building,
      floor: this.searchResult.floor,
      slot: this.searchResult.slot,
      gate: this.searchResult.gate,
    });
    if (this.logs.length > 5) this.logs.pop();
    this.searchResult = null;
    this.licensePlateStr = '';
  }
}
