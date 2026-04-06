import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { KioskIdleService } from '../services/kiosk-idle.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kiosk-layout',
  templateUrl: './kiosk-layout.component.html',
  styleUrls: ['./kiosk-layout.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class KioskLayoutComponent implements OnInit, OnDestroy {
  showWarning = false;
  countdown = 10;

  private warningSub?: Subscription;
  private countdownSub?: Subscription;

  constructor(
    public idle: KioskIdleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    document.body.classList.add('kiosk-mode');
    this.idle.start();

    this.warningSub = this.idle.showWarning$.subscribe((v: boolean) => {
      this.showWarning = v;
      this.cdr.detectChanges();
    });

    this.countdownSub = this.idle.countdown$.subscribe((v: number) => {
      this.countdown = v;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('kiosk-mode');
    this.idle.stop();
    this.warningSub?.unsubscribe();
    this.countdownSub?.unsubscribe();
  }

  /** Catch ALL touch/click/mouse events at the layout level */
  @HostListener('document:click')
  @HostListener('document:touchstart')
  @HostListener('document:mousemove')
  onGlobalActivity(): void {
    this.idle.onActivity();
  }

  /** When user taps the warning popup → dismiss & reset */
  onWarningTap(): void {
    this.idle.onActivity();
  }
}
