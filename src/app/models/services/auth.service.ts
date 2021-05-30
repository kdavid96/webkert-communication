import * as firebase from 'firebase/app';

import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Subject } from 'rxjs'
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = false;
  public authState: any = null;
  private logInErrorSubject = new Subject<string>();
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService) {
      this.afAuth.authState.subscribe( authState => {
        this.authState = authState;
      } )
    }

  msgConvert(err: string): string {
    switch(err){
      case 'auth/user-disabled': {
        return 'A felhasználói fiók fel van függesztve!';
      }
      case 'auth/user-not-found': {
        return 'A felhasználói fiók nem létezik!';
      }
      case 'auth/wrong-password': {
        return 'Hibás jelszó!';
      }
      default: {
        return 'Hiba a bejelentkezés közben!';
      }
    }
  }

  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password)
    .then(value => {
      this.loggedIn = true;
      this.toastr.success("Sikeres bejelentkezés", "Siker!", { positionClass: 'toast-top-center' });
      this.router.navigateByUrl('/profile');
    })
    .catch(error => {
      this.toastr.error(this.msgConvert(error['code']), "Hiba!", { positionClass: 'toast-top-center' });
      throw error;
    });
  }

  emailSignup(email: string, password: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(value => {
     this.toastr.success("Sikeres bejelentkezés", "Siker!", { positionClass: 'toast-top-center' });
     this.loggedIn = true;
     this.router.navigateByUrl('/profile');
    })
    .catch(error => {
      this.toastr.error(this.msgConvert(error['code']), "Hiba!", { positionClass: 'toast-top-center' });
      throw error;
    });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.loggedIn = false;
      this.toastr.success("Sikeres kijelentkezés", "Siker!", { positionClass: 'toast-top-center' });
      this.router.navigate(['/']);
    });
  }

  isLoggedIn(){
    return this.loggedIn;
  }


  currentUser(){
    if (!this.loggedIn || !this.authState){
      return "Vendég";
    }else{
      return this.authState.uid;
    }
  }
}