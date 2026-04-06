import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kiosk-welcome',
  templateUrl: './kiosk-welcome.page.html',
  styleUrls: ['./kiosk-welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class KioskWelcomePage {
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

  /** Navigate to the Kiosk Home (visitor type selection) */
  onTapStart(): void {
    this.router.navigate(['/kiosk', 'home']);
  }

  private updateClock(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.currentDate = now.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
