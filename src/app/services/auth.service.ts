import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type GuardRole    = 'guard' | 'super_guard';
export type StationType  = 'gate' | 'door_access';

export interface GuardSession {
  role:     GuardRole;
  station:  StationType;
  name:     string;
  building: string;
  gate:     string;
  floor:    string;
}

const STORAGE_KEY = 'fp_guard_session';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _session = new BehaviorSubject<GuardSession | null>(this._load());
  readonly session$ = this._session.asObservable();

  get session(): GuardSession | null { return this._session.value; }
  get role():    GuardRole   | null  { return this._session.value?.role    ?? null; }
  get station(): StationType | null  { return this._session.value?.station ?? null; }
  get isSuperGuard(): boolean        { return this._session.value?.role === 'super_guard'; }
  get isGateStation(): boolean       { return this._session.value?.station === 'gate'; }
  get isDoorStation(): boolean       { return this._session.value?.station === 'door_access'; }

  setSession(session: GuardSession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this._session.next(session);
  }

  updateStation(station: StationType): void {
    if (!this._session.value) return;
    this.setSession({ ...this._session.value, station });
  }

  updateRole(role: GuardRole): void {
    if (!this._session.value) return;
    this.setSession({ ...this._session.value, role });
  }

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._session.next(null);
  }

  hasSession(): boolean {
    return this._session.value !== null;
  }

  private _load(): GuardSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
