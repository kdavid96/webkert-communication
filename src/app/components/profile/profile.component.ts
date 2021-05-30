import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore/';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { AuthService } from '../../models/services/auth.service';
import { CommunicationService } from 'src/app/models/services/communication.service';
import { DialogAddComponent } from '../dialog-add/dialog-add.component';
import { MessagesService } from '../../models/services/messages.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../models/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  
  messagesArray = new Array();
  userArray = new Array();
  notificationsArray = new Array();
  remindersArray = new Array();
  alertsArray = new Array();
  instructionsArray = new Array();
  a = 0;
  name: String;
  userId: string;
  accountType: String;
  dialogRef;

  constructor(
    public authService: AuthService,
    public afstore: AngularFirestore,
    public userService: UserService,
    public messagesService: MessagesService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private communicationService: CommunicationService,
    private router: Router,
  ) {  }

  ngOnInit() {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/signin']);
    }
    this.communicationService.currentId.subscribe(_userId => this.userId = _userId);
    this.messagesArray = [];
    this.userArray = [];
    this.userService.getUsers().subscribe(items => {
      if(this.authService.authState){
        for (let i = 0; i < items.length; i++){
          this.userArray.push({uid: items[i].uid, firstName: items[i].firstName, lastName: items[i].lastName});
          if(items[i].email.replace(/\s/g, "") == this.authService.authState.email.replace(/\s/g, "")){
            this.name = items[i].firstName;
            this.userId = items[i].uid;
            this.accountType = items[i].accountType.toString();
            this.communicationService.changeId(this.userId);
          }
        }
      }
    });
    this.messagesService.getMessages().subscribe(items => {
      this.messagesArray = [];
      var localRecipient = "cimzett";
      var localSender = "felado";
      
      for(let i = 0; i < items.length; i++){
        if(items[i].recipient !== null && items[i].recipient.toString() == this.userId){
          for(let g = 0; g < this.userArray.length; g++){
            if(this.userArray[g].uid == items[i].recipient.toString()){
              localRecipient = this.userArray[g].firstName + " " + this.userArray[g].lastName;
            }
            if(this.userArray[g].uid == items[i].sender.toString()){
              localSender = this.userArray[g].firstName + " " + this.userArray[g].lastName;
            }
          }
          this.messagesArray.push({sender: localSender, recipient: localRecipient, content: items[i].text, type: items[i].type, state: items[i].state, status: items[i].status, id: items[i].id});
        }
      }
    });
  }

  ngOnDestroy(){
    console.log("Destroyed");
  }

  currentUser(){
    this.userService.getUsers().subscribe(items => {
      for (let i = 0; i < items.length; i++){
        if(items[i].uid == this.userService.getUID()){
          this.userId = items[i].uid;
          this.name = items[i].lastName; 
          break;
        }
      }
    });
    return this.authService.currentUser();
  }

  getUserId(){
    return this.userId;
  }
  
  getName(){
    return this.name;
  }

  getNotifications(){
    this.notificationsArray = [];
    for(let i = 0; i < this.messagesArray.length; i++){
      if(this.messagesArray[i].type == "notification"){
        this.notificationsArray.push(this.messagesArray[i]);
      }
    }
    return this.notificationsArray;
  }

  getReminders(){
    this.remindersArray = [];
    for(let i = 0; i < this.messagesArray.length; i++){
      if(this.messagesArray[i].type == "reminder"){
        this.remindersArray.push(this.messagesArray[i]);
      }
    }
    return this.remindersArray;
  }

  getInstructions(){
    this.instructionsArray = [];
    for(let i = 0; i < this.messagesArray.length; i++){
      if(this.messagesArray[i].type == "instruction"){
        this.instructionsArray.push(this.messagesArray[i]);
      }
    }
    return this.instructionsArray;
  }

  getAlerts(){
    this.alertsArray = [];
    for(let i = 0; i < this.messagesArray.length; i++){
      if(this.messagesArray[i].type == "alert"){
        this.alertsArray.push(this.messagesArray[i]);
      }
    }
    return this.alertsArray;
  }

  check(message){
    this.messagesService.completeMessage(message);
    this.toastr.success("Sikeresen teljesítés", "Siker!", { positionClass: 'toast-top-center' });
  }
  
  delete(message){
    this.messagesService.deleteMessage(message);
    this.toastr.error("Sikeres törlés", "Siker!", { positionClass: 'toast-top-center' });
  }

  save(message){
    this.messagesService.updateMessage(message);
    this.toastr.success("Sikeres mentés", "Siker!", { positionClass: 'toast-top-center' });
  }

  addMessage(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      userId: this.userId
    }
    this.dialogRef = this.dialog.open(DialogAddComponent, dialogConfig);
  }

  getAccountType(){
    return this.accountType;
  }
}
