import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  constructor(public auth: AuthService, private router: Router) {}

  changeStation() {
    // Go back to station select — keep role/session but allow change
    this.router.navigateByUrl('/station-select');
  }

  logout() {
    this.auth.clearSession();
    this.router.navigateByUrl('/station-select', { replaceUrl: true });
  }

  get stationLabel(): string {
    return this.auth.station === 'gate' ? 'ป้อมไม้กั้น / LPR' : 'ล็อบบี้ / ประตูอาคาร';
  }

  get stationIcon(): string {
    return this.auth.station === 'gate' ? 'git-branch-outline' : 'business-outline';
  }

  get roleLabel(): string {
    return this.auth.isSuperGuard ? 'หัวหน้า รปภ.' : 'รปภ. ทั่วไป';
  }

  get roleColor(): string {
    return this.auth.isSuperGuard ? '#D97706' : '#2563EB';
  }

  get roleBg(): string {
    return this.auth.isSuperGuard ? '#FEF3C7' : '#EEF2FF';
  }
}
