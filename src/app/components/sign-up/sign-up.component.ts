import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountType } from '../../models/enum/account-type.enum';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../models/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/interfaces/user';
import { UserService } from 'src/app/models/services/user.service';
import { VERSION } from '@angular/cdk';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signupForm: FormGroup;
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private afstore: AngularFirestore,
    private afAuth: AngularFireAuth,
    public user: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      accountType: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
      password: [null, Validators.required]
    });
  }

  async submit(){
    if (this.signupForm.valid){
      try{
        console.log(this.signupForm.value.accountType);
        this.authService.emailSignup(this.signupForm.value.email, this.signupForm.value.password);
        const res = await this.afAuth.createUserWithEmailAndPassword(this.signupForm.value.email,this.signupForm.value.password)
        this.afstore.doc(`users/${res.user.uid}`).set({
          accountType: this.signupForm.value.accountType,
          email: this.signupForm.value.email,
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
          password: this.signupForm.value.password,
          uid: res.user.uid,
        })

        this.user.setUser({
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
          uid: res.user.uid,
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
          accountType: this.signupForm.value.accountType,
        })
        this.toastr.success("Sikeres regisztráció!", "Siker!", { positionClass: 'toast-top-center' });

        this.router.navigate(['/profile']);
    }catch(error){
      console.dir(error)
      this.toastr.error(error, "Hiba!", { positionClass: 'toast-top-center' });
      }
    }
  }
}
