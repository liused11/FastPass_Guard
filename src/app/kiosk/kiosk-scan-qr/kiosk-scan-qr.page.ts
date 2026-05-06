import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

/** สถานะของหน้าจอ Scan */
type ScanState = 'scanning' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-kiosk-scan-qr',
  templateUrl: './kiosk-scan-qr.page.html',
  styleUrls: ['./kiosk-scan-qr.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class KioskScanQrPage {
  /** สถานะปัจจุบัน */
  state: ScanState = 'scanning';

  /** ข้อมูลแขกที่สแกนได้ */
  guestName = '';
  guestPurpose = '';

  /** ข้อความ error */
  errorMessage = '';

  /** Timer สำหรับ success redirect */
  private successTimer: any;

  /** Scan-line animation position (0-100) */
  scanLinePos = 0;
  private scanLineInterval: any;

  constructor(private router: Router, private zone: NgZone) {}

  // ─── Lifecycle ───────────────────────────────────────
  ionViewWillEnter(): void {
    this.state = 'scanning';
    this.startScanLineAnimation();
  }

  ionViewWillLeave(): void {
    clearTimeout(this.successTimer);
    clearInterval(this.scanLineInterval);
  }

  // ─── Navigation ──────────────────────────────────────
  goBack(): void {
    this.router.navigate(['/kiosk', 'home']);
  }

  // ─── Simulate QR scan (replace with real camera later) ──
  /**
   * เรียกเมื่อสแกน QR สำเร็จ (หรือกด demo button)
   * ในระบบจริงจะรับ payload จากกล้อง/scanner hardware
   */
  onQrScanned(payload?: string): void {
    this.state = 'loading';
    this.guestName = '';
    this.guestPurpose = '';

    // สมมติยิง API → รอ 1.5 วินาที
    setTimeout(() => {
      this.zone.run(() => {
        // ── Mock success ──
        const mockSuccess = true; // toggle เพื่อทดสอบ error flow

        if (mockSuccess) {
          this.guestName = 'คุณสมชาย ใจดี';
          this.guestPurpose = 'เยี่ยมชมโครงการ';
          this.state = 'success';

          // 4 วินาที → redirect กลับ home
          this.successTimer = setTimeout(() => {
            this.zone.run(() => {
              this.router.navigate(['/kiosk', 'home']);
            });
          }, 4000);
        } else {
          this.errorMessage = 'ไม่พบข้อมูล QR Code นี้ในระบบ กรุณาติดต่อ รปภ.';
          this.state = 'error';

          // 5 วินาที → กลับสู่ scanning
          this.successTimer = setTimeout(() => {
            this.zone.run(() => {
              this.state = 'scanning';
            });
          }, 5000);
        }
      });
    }, 1500);
  }

  /** กลับสู่หน้าจอ scan ใหม่ */
  retryScan(): void {
    clearTimeout(this.successTimer);
    this.state = 'scanning';
    this.startScanLineAnimation();
  }

  // ─── Internals ───────────────────────────────────────
  private startScanLineAnimation(): void {
    clearInterval(this.scanLineInterval);
    this.scanLinePos = 0;
    this.scanLineInterval = setInterval(() => {
      this.scanLinePos = (this.scanLinePos + 0.5) % 100;
    }, 20);
  }
}
