import { Component, OnInit } from '@angular/core';

interface Person {
  name: string;
  type: 'guard' | 'visitor' | 'staff';
  time: Date;
}

interface Building {
  name: string;
  guards: number;
  required: number;
  people: Person[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {

  isRefreshing = false;
  totalWalkIn   = 0;
  totalGuards   = 0;
  totalAvailable = 0;

  selectedBuilding: Building | null = null;

  buildings: Building[] = [
    {
      name: 'อาคาร FIBO',
      guards: 0,
      required: 1,
      people: [
        { name: 'John Doe', type: 'visitor', time: new Date(Date.now() - 3600000) }
      ]
    },
    {
      name: 'หอสมุด',
      guards: 1,
      required: 1,
      people: [
        { name: 'สมชาย รักเรียน', type: 'guard', time: new Date(Date.now() - 7200000) },
        { name: 'Jane Smith', type: 'visitor', time: new Date(Date.now() - 1800000) }
      ]
    },
    {
      name: 'อาคาร 9',
      guards: 1,
      required: 1,
      people: [
        { name: 'วิชัย กล้าหาญ', type: 'guard', time: new Date(Date.now() - 2400000) }
      ]
    },
    {
      name: 'อาคาร 10',
      guards: 0,
      required: 1,
      people: []
    },
    {
      name: 'อาคาร ICTRC',
      guards: 1,
      required: 1,
      people: [
        { name: 'ณัฐพล มั่นคง', type: 'guard', time: new Date(Date.now() - 3000000) }
      ]
    },
  ];

  constructor() { }

  ngOnInit() {
    this.calculateTotals();
  }

  calculateTotals() {
    this.totalGuards = this.buildings.reduce((sum, b) => sum + b.guards, 0);
    this.totalAvailable = this.buildings.reduce((sum, b) => sum + b.required, 0);
    this.totalWalkIn = this.buildings.reduce((sum, b) => sum + b.people.filter(p => p.type !== 'guard').length, 0);
  }

  refresh() {
    this.isRefreshing = true;
    setTimeout(() => {
      this.isRefreshing = false;
      this.calculateTotals();
    }, 1500);
  }

  selectBuilding(b: Building) {
    if (this.selectedBuilding?.name === b.name) {
      this.selectedBuilding = null;
    } else {
      this.selectedBuilding = b;
    }
  }

}
