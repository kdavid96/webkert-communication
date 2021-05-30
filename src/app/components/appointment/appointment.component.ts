import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/models/services/auth.service';
import { UserService } from 'src/app/models/services/user.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

  minDate = new Date();
  maxDate = new Date(2021, 11, 31);
  appointmentForm: FormGroup;
  doctorsArray = new Array();
  slotsArray = new Array();
  userId: string;
  accountType: String;

  dateFilter = date =>{
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.appointmentForm = this.formBuilder.group({
      doctor: [null, [Validators.required]],
      date: [null, [Validators.required]],
      problem: [null, [Validators.required]]
    });
    this.userId = this.authService.currentUser();
    this.doctorsArray = [];
    this.userService.getUsers().subscribe(items => {
      if(this.authService.authState){
        for (let i = 0; i < items.length; i++){
          if(items[i].uid !== this.userId && items[i].accountType.toString() === "doctor"){
            this.doctorsArray.push({uid: items[i].uid, firstName: items[i].firstName, lastName: items[i].lastName});
          }else{
            if(items[i].uid === this.userId){
              this.accountType = items[i].accountType.toString();
            }
          }
        }
        this.slotsArray = new Array();
        this.slotsArray.push({month:'September', day:'12', hour:'10', minutes:'10'});
      }
    });
  }

  getAccountType(){
    return this.accountType;
  }  

  submit(){
    if(this.appointmentForm.valid){
      console.log("időpont sikeresen lefoglalva");
    }else{
      console.log("szar az egész");
    }
  }

  listDoctors(){
    return this.doctorsArray;
  }

  listDoctorSlots(){
    this.slotsArray = new Array();
    this.slotsArray.push({month:'September', day:'12', hour:'10', minute:'10'});
    return this.slotsArray;
  }

}
