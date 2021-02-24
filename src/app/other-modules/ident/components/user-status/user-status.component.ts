import { Component, OnInit } from '@angular/core';

import { IUserToken } from '../../interfaces/i-user-token';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
})
export class UserStatusComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  logout(): void {
    this.loginService.logout();
  }

  get isLoggedIn(): boolean {
    return this.loginService.isLoggedIn;
  }

  get loggedInUser(): IUserToken {
    return this.loginService.loggedInUser;
  }
}
