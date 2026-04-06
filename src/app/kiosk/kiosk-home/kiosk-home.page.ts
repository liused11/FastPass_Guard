import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kiosk-home',
  templateUrl: './kiosk-home.page.html',
  styleUrls: ['./kiosk-home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class KioskHomePage {
  currentTime = '';
  currentDate = '';
  private timer: any;

  constructor(private router: Router) {}

  ionViewWillEnter(): void {
    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 1000);
  }

  ionViewWillLeave(): void {
    clearInterval(this.timer);
  }

  /** ปุ่มซ้าย: ผู้ที่มี QR Code */
  goScanQr(): void {
    this.router.navigate(['/kiosk', 'scan-qr']);
  }

  /** ปุ่มขวา: ผู้มาติดต่อทั่วไป */
  goRegister(): void {
    this.router.navigate(['/kiosk', 'register']);
  }

  private updateClock(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
    this.currentDate = now.toLocaleDateString('th-TH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
