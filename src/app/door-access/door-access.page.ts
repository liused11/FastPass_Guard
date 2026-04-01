import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

export type VisitorType = 'employee' | 'student' | 'visitor';

export interface WalkInEntry {
  name:     string;
  type:     VisitorType;
  time:     Date;
  action:   'check_in' | 'check_out';
  allowed:  string;
  avatar:   string; // initials
}

export interface VerifiedPerson {
  name:     string;
  type:     VisitorType;
  allowed:  string;
  avatar:   string;
  isVisitor: boolean;
  idHeld:   boolean;
}

@Component({
  selector: 'app-door-access',
  templateUrl: 'door-access.page.html',
  styleUrls: ['door-access.page.scss'],
  standalone: false,
})
export class DoorAccessPage {

  manualCode = '';
  scanning   = false;
  verified: VerifiedPerson | null = null;

  walkLog: WalkInEntry[] = [
    { name: 'ณัฐวุฒิ สมใจ',    type: 'employee', time: new Date(Date.now()-60000*2),  action: 'check_in',  allowed: 'ทุกชั้น',            avatar: 'ณ' },
    { name: 'มีนา วงศ์ดี',       type: 'student',  time: new Date(Date.now()-60000*7),  action: 'check_in',  allowed: 'ชั้น 1, 2',          avatar: 'ม' },
    { name: 'John Smith',        type: 'visitor',  time: new Date(Date.now()-60000*15), action: 'check_in',  allowed: 'ชั้น 1, ห้องประชุม A', avatar: 'J' },
    { name: 'ณัฐวุฒิ สมใจ',    type: 'employee', time: new Date(Date.now()-60000*45), action: 'check_out', allowed: 'ทุกชั้น',            avatar: 'ณ' },
  ];

  // Demo lookup table
  private _codeMap: Record<string, VerifiedPerson> = {
    'ABC123': { name: 'ณัฐวุฒิ สมใจ',  type: 'employee', allowed: 'ทุกชั้น',           avatar: 'ณ', isVisitor: false, idHeld: false },
    'STU456': { name: 'มีนา วงศ์ดี',    type: 'student',  allowed: 'ชั้น 1, 2',         avatar: 'ม', isVisitor: false, idHeld: false },
    'VIS789': { name: 'John Smith',      type: 'visitor',  allowed: 'ชั้น 1, ห้องประชุม A', avatar: 'J', isVisitor: true,  idHeld: false },
  };

  constructor(private alertCtrl: AlertController) {}

  // ── QR Scan (simulated) ──
  startScan() {
    this.scanning = true;
    // Simulate a scan result after 1.5s
    setTimeout(() => {
      this.scanning = false;
      this._lookup('VIS789');
    }, 1500);
  }

  // ── Manual Code Submit ──
  submitCode() {
    const code = this.manualCode.trim().toUpperCase();
    if (!code) return;
    this._lookup(code);
    this.manualCode = '';
  }

  // ── Lookup helper ──
  private _lookup(code: string) {
    const person = this._codeMap[code];
    if (person) {
      this.verified = { ...person };
    } else {
      this.verified = null;
      this.alertCtrl.create({
        header: 'ไม่พบรหัส',
        message: `รหัส "${code}" ไม่ถูกต้องหรือหมดอายุ`,
        cssClass: 'confirm-alert',
        buttons: [{ text: 'ตกลง', cssClass: 'alert-btn-cancel' }]
      }).then(a => a.present());
    }
  }

  clearVerified() {
    this.verified = null;
  }

  // ── Check-in / Check-out ──
  async doCheckin() {
    if (!this.verified) return;
    const a = await this.alertCtrl.create({
      header: 'ยืนยัน Check-in',
      message: `บันทึกเวลาเข้าให้ ${this.verified.name}?`,
      cssClass: 'confirm-alert',
      buttons: [
        { text: 'ยืนยัน', cssClass: 'alert-btn-open', handler: () => this._recordEntry('check_in') },
        { text: 'ยกเลิก', role: 'cancel', cssClass: 'alert-btn-cancel' }
      ]
    });
    await a.present();
  }

  async doCheckout() {
    if (!this.verified) return;
    const a = await this.alertCtrl.create({
      header: 'ยืนยัน Check-out',
      message: `บันทึกเวลาออกให้ ${this.verified.name}?`,
      cssClass: 'confirm-alert',
      buttons: [
        { text: 'ยืนยัน', cssClass: 'alert-btn-close', handler: () => this._recordEntry('check_out') },
        { text: 'ยกเลิก', role: 'cancel', cssClass: 'alert-btn-cancel' }
      ]
    });
    await a.present();
  }

  toggleIdHold() {
    if (!this.verified) return;
    this.verified.idHeld = !this.verified.idHeld;
  }

  private _recordEntry(action: 'check_in' | 'check_out') {
    if (!this.verified) return;
    this.walkLog.unshift({
      name:    this.verified.name,
      type:    this.verified.type,
      time:    new Date(),
      action,
      allowed: this.verified.allowed,
      avatar:  this.verified.avatar,
    });
    this.verified = null;
  }

  typeLabel(t: VisitorType): string {
    return { employee: 'พนักงาน', student: 'นักศึกษา', visitor: 'Visitor' }[t];
  }

  typeColor(t: VisitorType): string {
    return { employee: '#2563EB', student: '#7C3AED', visitor: '#D97706' }[t];
  }

  typeBg(t: VisitorType): string {
    return { employee: '#EEF2FF', student: '#F5F3FF', visitor: '#FEF3C7' }[t];
  }

  actionLabel(a: string): string {
    return a === 'check_in' ? 'เข้า' : 'ออก';
  }

  actionColor(a: string): string {
    return a === 'check_in' ? '#16A34A' : '#DC2626';
  }
}
