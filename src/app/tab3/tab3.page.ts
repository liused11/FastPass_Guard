import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

interface GuardReport {
  id: number;
  guardName: string;
  station: string;
  message: string;
  detail: string;
  time: Date;
  severity: 'high' | 'medium' | 'low';
  read: boolean;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  guardReports: GuardReport[] = [
    {
      id: 1,
      guardName: 'สมปอง มีธรรม',
      station: 'อาคาร FIBO · Gate A',
      message: 'เกิดการทะเลาะวิวาทบริเวณลานจอดรถชั้น B1',
      detail: 'ผู้ขับขี่รถ ป้าย กข-1234 และ ป้าย คง-9999 เกิดการโตเถียงกันในลานจอดรถ ชั้น B1 อาคาร FIBO เวลา 13:42 น. ได้ดำเนินการสั่งให้แยกออกเบื้องต้นแล้ว',
      time: new Date(Date.now() - 1000*60*8),
      severity: 'high',
      read: false
    },
    {
      id: 2,
      guardName: 'วิชัย เข่มแข็ง',
      station: 'อาคาร 9 · Gate B',
      message: 'รถจอดแดงทับซ้ายทางออกฉุกเฉินบริเวณหน้าตึก',
      detail: 'มีรถยนต์จอดแบบผิดกฎหมายในเขตห้ามจอด บริเวณลานออกซักษ์อาคาร 9 ขอร้องให้ทีมปฤะบนฟันดำเนินการ ป้าย ขค-0055',
      time: new Date(Date.now() - 1000*60*35),
      severity: 'medium',
      read: false
    },
    {
      id: 3,
      guardName: 'อนุชา แสงสว่าง',
      station: 'หอสมุด · ล็อบบี้',
      message: 'รายงานประจำวัน — Check-in 42 คัน, Check-out 38 คัน',
      detail: 'ยอดการเข้าออกประจำวัน: Check-in 42 คัน / Check-out 38 คัน อยู่ในอาคารอีก 4 คัน ไม่พบความผิดปกติใดๆ',
      time: new Date(Date.now() - 1000*60*90),
      severity: 'low',
      read: true
    },
  ];

  constructor(
    public auth: AuthService, 
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async openReport(report: GuardReport) {
    report.read = true;
    const severityLabel = report.severity === 'high' ? '🔴 เร่งด่วนสูง' : report.severity === 'medium' ? '🟡 ปานกลาง' : '🟢 ปกติ';
    const alert = await this.alertCtrl.create({
      header: report.guardName,
      message: `[${severityLabel}]\n${report.station}\n\n${report.detail}`,
      cssClass: 'confirm-alert',
      buttons: [
        { text: 'รับทราบ', cssClass: 'alert-btn-open' },
        { text: 'ปิด', role: 'cancel', cssClass: 'alert-btn-cancel' }
      ]
    });
    await alert.present();
  }

  async sendDailyReport() {
    const alert = await this.alertCtrl.create({
      header: 'ส่งรายงานประจำวัน',
      message: 'ยืนยันการส่งรายงานสรุปยอดรถเข้า-ออกประจำวันให้หัวหน้า รปภ. (Super Guard)?',
      cssClass: 'confirm-alert',
      buttons: [
        {
          text: 'ยืนยัน',
          cssClass: 'alert-btn-open',
          handler: async () => {
            const toast = await this.toastCtrl.create({
              message: '✓ ส่งรายงานประจำวันเรียบร้อย',
              duration: 2500,
              color: 'success',
              position: 'top'
            });
            await toast.present();
          }
        },
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'alert-btn-cancel'
        }
      ]
    });
    await alert.present();
  }

  changeStation() {
    // Go back to station select — keep role/session but allow change
    this.router.navigateByUrl('/station-select');
  }

  openDashboard() {
    this.router.navigateByUrl('/tabs/dashboard');
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
