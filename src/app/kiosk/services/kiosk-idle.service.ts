import { Injectable, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription, filter } from 'rxjs';

/**
 * KioskIdleService
 * ─────────────────
 * Centralized idle-timeout service for all pages under /kiosk.
 *
 * How it works:
 * 1. Listens for touch/click/mouse events on the document.
 * 2. After `IDLE_SECONDS` of inactivity, shows a countdown warning.
 * 3. If nobody responds within `WARN_SECONDS`, navigates to /kiosk/home.
 * 4. Any touch during warning resets the whole cycle.
 * 5. Automatically pauses on /kiosk/welcome (screensaver page).
 */
@Injectable({ providedIn: 'root' })
export class KioskIdleService {
  /** ── Config ── */
  readonly IDLE_SECONDS = 30;
  readonly WARN_SECONDS = 10;

  /** ── Observable state ── */
  /** true = warning popup should be visible */
  readonly showWarning$ = new BehaviorSubject<boolean>(false);
  /** seconds remaining in countdown (10…1) */
  readonly countdown$ = new BehaviorSubject<number>(this.WARN_SECONDS);

  /** ── Internal ── */
  private idleTimeout: any;
  private countdownInterval: any;
  private active = false;
  private routerSub?: Subscription;

  /** Pages where idle should NOT trigger (e.g. screensaver) */
  private readonly EXEMPT_ROUTES = ['/kiosk/welcome'];

  constructor(private router: Router, private zone: NgZone) {}

  // ─── Public API ────────────────────────────────────

  /** Call from KioskLayoutComponent.ngOnInit */
  start(): void {
    if (this.active) return;
    this.active = true;

    // Listen to route changes to auto-pause on exempt pages
    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const nav = e as NavigationEnd;
        if (this.isExempt(nav.urlAfterRedirects || nav.url)) {
          this.pause();
        } else {
          this.resume();
        }
      });

    // If current route is not exempt, start immediately
    if (!this.isExempt(this.router.url)) {
      this.resetIdleTimer();
    }
  }

  /** Call from KioskLayoutComponent.ngOnDestroy */
  stop(): void {
    this.active = false;
    this.clearAll();
    this.routerSub?.unsubscribe();
  }

  /** Call on every user interaction (touch/click/mousemove) */
  onActivity(): void {
    if (!this.active) return;

    // If warning is showing, dismiss it
    if (this.showWarning$.value) {
      this.dismissWarning();
    }

    this.resetIdleTimer();
  }

  // ─── Internals ─────────────────────────────────────

  private resetIdleTimer(): void {
    clearTimeout(this.idleTimeout);
    clearInterval(this.countdownInterval);
    this.showWarning$.next(false);

    this.idleTimeout = setTimeout(() => {
      this.zone.run(() => this.startWarning());
    }, this.IDLE_SECONDS * 1000);
  }

  private startWarning(): void {
    this.showWarning$.next(true);
    let remaining = this.WARN_SECONDS;
    this.countdown$.next(remaining);

    this.countdownInterval = setInterval(() => {
      remaining--;
      this.zone.run(() => {
        this.countdown$.next(remaining);

        if (remaining <= 0) {
          this.onTimeout();
        }
      });
    }, 1000);
  }

  private onTimeout(): void {
    this.clearAll();
    this.showWarning$.next(false);

    // Navigate back to home
    this.zone.run(() => {
      this.router.navigate(['/kiosk', 'home']).then(() => {
        // restart idle timer on the home page
        this.resetIdleTimer();
      });
    });
  }

  private dismissWarning(): void {
    clearInterval(this.countdownInterval);
    this.showWarning$.next(false);
    this.countdown$.next(this.WARN_SECONDS);
  }

  private pause(): void {
    this.clearAll();
    this.showWarning$.next(false);
  }

  private resume(): void {
    this.resetIdleTimer();
  }

  private clearAll(): void {
    clearTimeout(this.idleTimeout);
    clearInterval(this.countdownInterval);
  }

  private isExempt(url: string): boolean {
    return this.EXEMPT_ROUTES.some((r) => url.startsWith(r));
  }
}
