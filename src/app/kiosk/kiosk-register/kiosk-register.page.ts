import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type RegisterState = 'id-card' | 'form' | 'submitting' | 'success';

@Component({
  selector: 'app-kiosk-register',
  templateUrl: './kiosk-register.page.html',
  styleUrls: ['./kiosk-register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class KioskRegisterPage {
  state: RegisterState = 'id-card';

  /* ── ข้อมูลจากบัตรประชาชน (mock) ── */
  idCardNumber = '';
  fullName = '';
  idCardLoading = false;

  /* ── ข้อมูลที่ผู้ใช้กรอกเพิ่ม ── */
  licensePlate = '';
  destination = '';

  /* ── Dropdown ── */
  destinations = [
    'อาคาร A — สำนักงานขาย',
    'อาคาร B — ฝ่ายบุคคล',
    'อาคาร C — ห้องประชุม',
    'อาคาร D — คลังสินค้า',
    'นิติบุคคล',
    'อื่นๆ',
  ];

  /* ── Success timer ── */
  private successTimer: any;

  constructor(private router: Router, private zone: NgZone) {}

  // ─── Lifecycle ─────────────────────────────────────
  ionViewWillEnter(): void {
    this.resetForm();
    this.state = 'id-card';
  }

  ionViewWillLeave(): void {
    clearTimeout(this.successTimer);
  }

  // ─── Navigation ────────────────────────────────────
  goBack(): void {
    this.router.navigate(['/kiosk', 'home']);
  }

  // ─── Mock อ่านบัตร ─────────────────────────────────
  mockReadIdCard(): void {
    this.idCardLoading = true;

    setTimeout(() => {
      this.zone.run(() => {
        this.idCardNumber = '1-1234-56789-01-2';
        this.fullName = 'นายสมชาย ใจดี';
        this.idCardLoading = false;
        this.state = 'form';
      });
    }, 2000);
  }

  // ─── Submit ────────────────────────────────────────
  get canSubmit(): boolean {
    return !!(this.fullName && this.idCardNumber && this.destination);
  }

  onSubmit(): void {
    if (!this.canSubmit) return;

    this.state = 'submitting';

    // Mock API call
    setTimeout(() => {
      this.zone.run(() => {
        this.state = 'success';

        this.successTimer = setTimeout(() => {
          this.zone.run(() => {
            this.router.navigate(['/kiosk', 'home']);
          });
        }, 5000);
      });
    }, 1800);
  }

  // ─── Internals ─────────────────────────────────────
  private resetForm(): void {
    this.idCardNumber = '';
    this.fullName = '';
    this.licensePlate = '';
    this.destination = '';
    this.idCardLoading = false;
  }
}
