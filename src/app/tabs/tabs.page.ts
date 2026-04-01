import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    // If no session, send to station select
    if (!this.auth.hasSession()) {
      this.router.navigateByUrl('/station-select', { replaceUrl: true });
    }
  }
}
