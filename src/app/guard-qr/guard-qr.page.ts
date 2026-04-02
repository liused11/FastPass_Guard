import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-guard-qr',
  templateUrl: 'guard-qr.page.html',
  styleUrls: ['guard-qr.page.scss'],
  standalone: false,
})
export class GuardQrPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('qrCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  guardName     = 'รปภ';
  guardBuilding = '';
  guardInitials = 'ร';
  guardCode     = '';

  expiryCountdown = '5:00';
  spinning = false;

  private _expiryMs   = 5 * 60 * 1000; // 5 minutes
  private _expiryEnd  = 0;
  private _timerInterval: any;

  constructor(private auth: AuthService, private alertCtrl: AlertController) {}

  ngOnInit() {
    const s = this.auth.session;
    if (s) {
      this.guardName     = s.name || 'รปภ';
      this.guardBuilding = s.building || '';
      this.guardInitials = (s.name || 'ร').charAt(0).toUpperCase();
    }
    this._generateCode();
    this._startTimer();
  }

  ngAfterViewInit() {
    this._renderQR();
  }

  ngOnDestroy() {
    clearInterval(this._timerInterval);
  }

  // ── Generate a random guard access code ──
  private _generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code    = 'GRD-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.guardCode  = code;
    this._expiryEnd = Date.now() + this._expiryMs;
  }

  // ── Render QR to canvas ──
  private _renderQR() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const size   = Math.min(window.innerWidth - 120, 240);

    const payload = JSON.stringify({
      code:     this.guardCode,
      name:     this.guardName,
      building: this.guardBuilding,
      role:     'guard',
      ts:       Date.now(),
    });

    QRCode.toCanvas(canvas, payload, {
      width:           size,
      margin:          1,
      color: {
        dark:  '#1E293B',
        light: '#F8FAFD',
      },
      errorCorrectionLevel: 'M',
    });
  }

  // ── Countdown timer ──
  private _startTimer() {
    this._timerInterval = setInterval(() => {
      const remaining = this._expiryEnd - Date.now();
      if (remaining <= 0) {
        this._generateCode();
        setTimeout(() => this._renderQR(), 0);
      } else {
        const m = Math.floor(remaining / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        this.expiryCountdown = `${m}:${s.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  // ── Manual refresh ──
  refreshQR() {
    this.spinning = true;
    this._generateCode();
    setTimeout(() => {
      this._renderQR();
      this.spinning = false;
    }, 400);
  }

  // ── Copy code ──
  async copyCode() {
    try {
      await navigator.clipboard.writeText(this.guardCode);
      const toast = await this.alertCtrl.create({
        header: 'คัดลอกแล้ว',
        message: `รหัส ${this.guardCode} ถูกคัดลอกไปยังคลิปบอร์ดแล้ว`,
        cssClass: 'confirm-alert',
        buttons: [{ text: 'ตกลง', cssClass: 'alert-btn-cancel' }]
      });
      await toast.present();
    } catch {
      /* clipboard not available */
    }
  }
}
