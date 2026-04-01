import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, GuardRole, StationType } from '../services/auth.service';

@Component({
  selector: 'app-station-select',
  templateUrl: 'station-select.page.html',
  styleUrls: ['station-select.page.scss'],
  standalone: false,
})
export class StationSelectPage implements OnInit {

  selectedRole: GuardRole = 'guard';
  selectedStation: StationType | null = null;

  // Demo officer data — replace with real auth later
  officerName = 'Officer John';
  building = 'อาคาร FIBO';

  stations = [
    {
      id: 'gate' as StationType,
      icon: 'barrier-outline',
      ionIcon: 'git-branch-outline',
      label: 'LPR',
      sublabel: 'ควบคุมไม้กั้น, ตรวจสอบป้ายทะเบียน',
      color: '#10B981',
      bg: '#ECFDF5',
      border: '#6EE7B7',
    },
    {
      id: 'door_access' as StationType,
      ionIcon: 'business-outline',
      label: 'Door Access',
      sublabel: 'สแกน QR, ยืนยันตัวตน, บันทึกเข้า-ออก',
      color: '#2563EB',
      bg: '#EEF2FF',
      border: '#A5B4FC',
    },
  ];

  roles: { id: GuardRole; label: string; icon: string }[] = [
    { id: 'guard', label: 'รปภ. ทั่วไป', icon: 'shield-outline' },
    { id: 'super_guard', label: 'หัวหน้า รปภ.', icon: 'shield-checkmark' },
  ];

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    // Pre-fill from existing session if any
    const s = this.auth.session;
    if (s) {
      this.selectedRole = s.role;
      this.selectedStation = s.station;
    }
  }

  selectStation(id: StationType) {
    this.selectedStation = id;
  }

  confirm() {
    if (!this.selectedStation) return;
    this.auth.setSession({
      role: this.selectedRole,
      station: this.selectedStation,
      name: this.officerName,
      building: this.building,
      gate: 'Gate A',
      floor: 'ชั้น B1',
    });
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }
}
