import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/models/services/auth.service';
import { UserService } from 'src/app/models/services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessagesService } from 'src/app/models/services/messages.service';
import { Message } from '../../models/interfaces/message';
import { Sender } from '../../models/interfaces/sender';
import { Status } from '../../models/enum/status.enum';
import { MatRippleModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/models/services/communication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.scss']
})
export class DialogAddComponent implements OnInit {

  addMessageForm: FormGroup;
  userArray = new Array();
  name: string;
  userId: string;
  msg: Message;
  sender: Sender;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DialogAddComponent>,
    private toastr: ToastrService,
    private messagesService: MessagesService,
    private communicationService: CommunicationService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) data
    ) { 
      this.addMessageForm = this.formBuilder.group({
        type: [null, Validators.required],
        uid: [null, Validators.required],
        text: [null, Validators.required],
        priority: [null, Validators.required],
      });
      this.userId = data.userId;
      this.communicationService.changeId(data.userId);
    }

  ngOnInit(): void {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/signin']);
    }
    this.userArray = [];
    this.userService.getUsers().subscribe(items => {
      if(this.authService.authState){
        for (let i = 0; i < items.length; i++){
          if(items[i].uid !== this.userId){
            this.userArray.push({uid: items[i].uid, firstName: items[i].firstName, lastName: items[i].lastName});
          }else{
            this.sender = {id: items[i].uid, firstName: items[i].firstName, lastName: items[i].lastName};
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    console.log("Destroyed");
  }

  submit() {
    for(let i = 0; i < this.userArray.length; i++){
      if(this.userArray[i].uid == this.userId){
        this.sender = this.userArray[i];
      }
    }
    this.msg = {
      sender: this.sender,
      recipient: this.addMessageForm.value.uid,
      text: this.addMessageForm.value.text,
      type: this.addMessageForm.value.type,
      priority: this.addMessageForm.value.priority,
      state: this.addMessageForm.value.priority,
      status: Status.preparation,
      id: "0"
    }
    if(this.msg.sender !== null && this.msg.recipient !== null && this.msg.text !== null && this.msg.type !== null && this.msg.priority !== null && this.msg.state !== null && this.msg.status !== null){
      this.messagesService.setMessage(this.msg);
      this.addMessageForm.reset();
      for (let name in this.addMessageForm.controls) {
        this.addMessageForm.controls[name].setErrors(null);
      }
      this.toastr.success("Az üzenet elküldése sikeres!", "Siker!", { positionClass: 'toast-top-center' });
    }else{
      this.toastr.error("Az összes mező kitöltése kötelező!", "Hiba!", { positionClass: 'toast-top-center' });
    }
    
  }

  listUsers(){
    return this.userArray;
  }

}
