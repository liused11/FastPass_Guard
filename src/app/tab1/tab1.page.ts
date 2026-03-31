import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface LprEntry {
  plate: string;
  time: Date;
  status: 'Success' | 'Denied';
  gate: string;
  building: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  mode: 'auto' | 'manual' = 'auto';
  gateStatus: 'Open' | 'Closed' | 'Moving' = 'Closed';
  vehicleType: string = 'car';
  holdOpen = false;
  emergencyTriggered = false;

  building = 'อาคาร FIBO';
  gate = 'Gate A';
  floor = 'ชั้น B1';

  lastScan: LprEntry = {
    plate: 'กข-1234',
    time: new Date(Date.now() - 1000 * 45),
    status: 'Success',
    gate: 'Gate A',
    building: 'อาคาร FIBO',
  };

  lprFeed: LprEntry[] = [
    { plate: 'กข-1234', time: new Date(Date.now() - 1000*45),  status: 'Success', gate: 'Gate A', building: 'อาคาร FIBO' },
    { plate: 'ขค-5678', time: new Date(Date.now() - 1000*180), status: 'Success', gate: 'Gate A', building: 'อาคาร FIBO' },
    { plate: 'คง-9999', time: new Date(Date.now() - 1000*360), status: 'Denied',  gate: 'Gate A', building: 'อาคาร FIBO' },
  ];

  private _clockInterval: any;
  now = new Date();

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {
    this._clockInterval = setInterval(() => { this.now = new Date(); }, 30000);
  }

  ngOnDestroy() {
    clearInterval(this._clockInterval);
  }

  toggleMode() {
    this.mode = this.mode === 'auto' ? 'manual' : 'auto';
  }

  // ── Confirmation popups ──

  async manualOpen() {
    const alert = await this.alertCtrl.create({
      header: 'ยืนยันการเปิดประตู',
      message: `เปิด ${this.gate} (${this.building}) ด้วยตนเอง?`,
      cssClass: 'confirm-alert',
      buttons: [
        {
          text: 'เปิดประตู',
          cssClass: 'alert-btn-open',
          handler: () => {
            if (this.gateStatus === 'Moving') return;
            this.gateStatus = 'Moving';
            setTimeout(() => { this.gateStatus = 'Open'; }, 1800);
          }
        },
        { text: 'ยกเลิก', role: 'cancel', cssClass: 'alert-btn-cancel' }
      ]
    });
    await alert.present();
  }

  async forceClose() {
    const alert = await this.alertCtrl.create({
      header: 'ยืนยันการปิดประตู',
      message: `บังคับปิด ${this.gate} (${this.building})?`,
      cssClass: 'confirm-alert',
      buttons: [
        {
          text: 'ปิดประตู',
          cssClass: 'alert-btn-close',
          handler: () => {
            this.holdOpen = false;
            if (this.gateStatus === 'Moving') return;
            this.gateStatus = 'Moving';
            setTimeout(() => { this.gateStatus = 'Closed'; }, 1800);
          }
        },
        { text: 'ยกเลิก', role: 'cancel', cssClass: 'alert-btn-cancel' }
      ]
    });
    await alert.present();
  }

  async toggleHoldOpen() {
    if (this.holdOpen) {
      const alert = await this.alertCtrl.create({
        header: 'ปล่อย Hold Open',
        message: 'ประตูจะกลับสู่โหมดปกติ',
        cssClass: 'confirm-alert',
        buttons: [
          {
            text: 'ยืนยัน',
            cssClass: 'alert-btn-hold',
            handler: () => { this.holdOpen = false; }
          },
          { text: 'ยกเลิก', role: 'cancel', cssClass: 'alert-btn-cancel' }
        ]
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Hold Open',
        message: `ค้างประตูเปิดไว้จนกว่าจะปล่อย\n${this.gate} · ${this.building}`,
        cssClass: 'confirm-alert',
        buttons: [
          {
            text: 'ยืนยัน Hold Open',
            cssClass: 'alert-btn-hold',
            handler: () => {
              this.holdOpen = true;
              this.gateStatus = 'Open';
            }
          },
          { text: 'ยกเลิก', role: 'cancel', cssClass: 'alert-btn-cancel' }
        ]
      });
      await alert.present();
    }
  }

  async triggerEmergencyAlert() {
    const alert = await this.alertCtrl.create({
      header: 'แจ้เหตุฉุกเฉิน',
      message: `ส่งสัญญาณแจ้เหตุหน่วยงานที่เกี่ยวข้องทันที\n${this.gate} · ${this.building}`,
      cssClass: 'confirm-alert confirm-alert-danger',
      buttons: [
        {
          text: 'ยืนยันส่งสัญญาณ',
          cssClass: 'alert-btn-emergency',
          handler: () => {
            this.emergencyTriggered = true;
            console.log('EMERGENCY ALERT TRIGGERED —', this.building, this.gate);
            // TODO: call real API / push notification here
            setTimeout(() => { this.emergencyTriggered = false; }, 10000);
          }
        },
        { text: 'ยกเลิก', role: 'cancel', cssClass: 'alert-btn-cancel' }
      ]
    });
    await alert.present();
  }
}
