import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AuthService } from '../../models/services/auth.service';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();

  private isLoggedIn: boolean = false;
  constructor(public authService: AuthService, public SignInComponent: SignInComponent) {}

  ngOnInit(): void {}

  getLoggedIn(): any{
    this.isLoggedIn = this.authService.isLoggedIn();
    return this.isLoggedIn;
  }

  logout(): any{
    this.SignInComponent.logout();
  }

  onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
