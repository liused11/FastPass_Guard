import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

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
  blacklistedPlates: string[] = [];

  logs: LogEntry[] = [
    { plate: 'กข-1234', time: new Date(Date.now() - 1000*60*5),  status: 'Check-in',  building: 'อาคาร FIBO', floor: 'ชั้น 3', slot: 'B14', gate: 'Gate A' },
    { plate: 'ขค-5678', time: new Date(Date.now() - 1000*60*22), status: 'Check-out', building: 'อาคาร FIBO', floor: 'ชั้น 2', slot: 'A07', gate: 'Gate A' },
    { plate: 'คง-9999', time: new Date(Date.now() - 1000*60*41), status: 'Check-in',  building: 'อาคาร FIBO', floor: 'ชั้น 1', slot: 'C02', gate: 'Gate B' },
    { plate: 'งจ-3344', time: new Date(Date.now() - 1000*60*58), status: 'Check-out', building: 'อาคาร 9',   floor: 'ชั้น 4', slot: 'D19', gate: 'Gate A' },
  ];

  constructor(public auth: AuthService, private alertCtrl: AlertController) {}

  isBlacklisted(): boolean {
    return !!this.searchResult && this.blacklistedPlates.includes(this.searchResult.plate);
  }

  async blacklistPlate() {
    if (!this.searchResult) return;
    const plate = this.searchResult.plate;
    const isAlreadyBlacklisted = this.blacklistedPlates.includes(plate);

    if (isAlreadyBlacklisted) {
      const alert = await this.alertCtrl.create({
        header: 'ยกเลิก Blacklist',
        message: `ยืนยันการยกเลิก Blacklist ป้ายทะเบียน ${plate}?`,
        cssClass: 'confirm-alert',
        buttons: [
          { text: 'ยืนยัน', cssClass: 'alert-btn-open', handler: () => {
            this.blacklistedPlates = this.blacklistedPlates.filter(p => p !== plate);
            if (this.searchResult) this.searchResult.isBlacklisted = false;
          }},
          { text: 'ยกเลิก', role: 'cancel', cssClass: 'alert-btn-cancel' }
        ]
      });
      return alert.present();
    }

    const alert = await this.alertCtrl.create({
      header: '⛔ เพิ่ม Blacklist',
      message: `ยืนยันการ Blacklist ป้ายทะเบียน ${plate}?\nรถคันนี้จะไม่สามารถจองที่จอดรถได้อีก`,
      cssClass: 'confirm-alert confirm-alert-danger',
      buttons: [
        { text: 'Blacklist', cssClass: 'alert-btn-emergency', handler: () => {
          this.blacklistedPlates.push(plate);
          if (this.searchResult) this.searchResult.isBlacklisted = true;
        }},
        { text: 'ยกเลิก', role: 'cancel', cssClass: 'alert-btn-cancel' }
      ]
    });
    return alert.present();
  }

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
      floor: 'ชั้น 4',
      zone: 'B14',
      doorAccesses: [
        'อาคาร FIBO ชั้น 2 เข้าห้อง 1A-1, 1A-2 ได้',
        'อาคาร FIBO ชั้น 4 เข้าห้อง 4A-1 ได้'
      ],
      bookingTimes: ['13:30 - 16:30', '20:00 - 21:30']
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
