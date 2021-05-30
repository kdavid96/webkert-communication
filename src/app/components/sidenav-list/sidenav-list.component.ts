import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AuthService } from '../../models/services/auth.service';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Output() sidenavClose = new EventEmitter();
  private isLoggedIn: boolean = false;
  constructor(public authService: AuthService, public SignInComponent: SignInComponent) { }

  ngOnInit(): void {
  }

  getLoggedIn(): any{
    this.isLoggedIn = this.authService.isLoggedIn();
    return this.isLoggedIn;
  }

  onSidenavClose = () =>{
    this.sidenavClose.emit();
  }

}
